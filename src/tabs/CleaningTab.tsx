import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Trash, FolderOpen, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { InteractiveCard } from '@/components/enhanced/InteractiveCard';
import { AnimatedButton } from '@/components/enhanced/AnimatedButton';
import { LoadingState } from '@/components/enhanced/LoadingState';
import StatDisplay from '@/components/enhanced/StatDisplay';
import { useReducedMotion } from '@/hooks/useReducedMotion';


interface TempFile {
  path: string;
  name: string;
  size: number;
  category: string;
  root_path: string;
}

interface ScanResult {
  files: TempFile[];
  total_size: number;
}

// Page transition variants for Framer Motion
const getPageVariants = (shouldReduceMotion: boolean) => ({
  initial: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: shouldReduceMotion ? 0 : 0.3 }
  },
  exit: {
    opacity: shouldReduceMotion ? 1 : 0,
    y: shouldReduceMotion ? 0 : -20,
    transition: { duration: shouldReduceMotion ? 0 : 0.2 }
  }
});

export default function CleaningTab() {
  const shouldReduceMotion = useReducedMotion();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deleteComplete, setDeleteComplete] = useState(false);
  const [deletedSize, setDeletedSize] = useState(0);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleScan = async () => {
    setIsScanning(true);
    setIsDialogOpen(true);
    setDeleteComplete(false);

    try {
      const result = await invoke<ScanResult>('scan_temp_files');
      setScanResult(result);
      // Select all by default
      setSelectedFiles(new Set(result.files.map(f => f.path)));
      // Collapse all categories by default
      const categories = result.files.reduce((acc, file) => {
        acc.add(file.category);
        return acc;
      }, new Set<string>());
      setCollapsedCategories(categories);
    } catch (error) {
      console.error('Erro ao escanear:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const toggleFile = (path: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(path)) {
      newSelected.delete(path);
    } else {
      newSelected.add(path);
    }
    setSelectedFiles(newSelected);
  };

  const toggleCategory = (category: string) => {
    const categoryFiles = scanResult?.files.filter(f => f.category === category) || [];
    const allSelected = categoryFiles.every(f => selectedFiles.has(f.path));

    const newSelected = new Set(selectedFiles);
    categoryFiles.forEach(f => {
      if (allSelected) {
        newSelected.delete(f.path);
      } else {
        newSelected.add(f.path);
      }
    });
    setSelectedFiles(newSelected);
  };

  const toggleCollapse = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  const handleOpenFolder = async (path: string) => {
    try {
      await invoke('open_folder_location', { path });
    } catch (error) {
      console.error('Erro ao abrir pasta:', error);
    }
  };

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      unlisten = await listen<{ current: number; total: number; percentage: number; deleted_size: number }>(
        'delete-progress',
        (event) => {
          setDeleteProgress(Math.round(event.payload.percentage));
          setDeletedSize(event.payload.deleted_size);
        }
      );
    };

    setupListener();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const handleDelete = async () => {
    if (selectedFiles.size === 0) return;

    setIsDeleting(true);
    setDeleteProgress(0);
    setDeletedSize(0);

    try {
      const pathsToDelete = Array.from(selectedFiles);
      const result = await invoke<number>('delete_temp_files', { paths: pathsToDelete });

      setDeleteProgress(100);
      setDeletedSize(result);
      setDeleteComplete(true);
    } catch (error) {
      console.error('Erro ao deletar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getSelectedSize = () => {
    if (!scanResult) return 0;
    return scanResult.files
      .filter(f => selectedFiles.has(f.path))
      .reduce((sum, f) => sum + f.size, 0);
  };

  const groupedFiles = scanResult?.files.reduce((acc, file) => {
    if (!acc[file.category]) {
      acc[file.category] = [];
    }
    acc[file.category].push(file);
    return acc;
  }, {} as Record<string, TempFile[]>) || {};

  return (
    <>
      <motion.div
        variants={getPageVariants(shouldReduceMotion)}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-6 lg:space-y-8"
      >
        <h2 className="text-xl lg:text-2xl font-medium text-[var(--color-text-primary)] tracking-tight">
          Limpeza do Sistema
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 transition-all duration-[var(--transition-base)]">
          {/* Arquivos Temporários Card */}
          <InteractiveCard className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <Trash2 className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <h3 className="text-base font-medium text-[var(--color-text-primary)]">
                Arquivos Temporários
              </h3>
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
              Limpar cache e arquivos temporários do sistema
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
              Escaneie para ver quanto espaço pode ser liberado
            </p>
            <AnimatedButton
              onClick={handleScan}
              disabled={isScanning}
              loading={isScanning}
              variant="primary"
              size="md"
              className="w-full"
            >
              {isScanning ? 'Escaneando...' : 'Escanear Agora'}
            </AnimatedButton>
          </InteractiveCard>

          {/* Lixeira Card */}
          <InteractiveCard className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <Trash className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <h3 className="text-base font-medium text-[var(--color-text-primary)]">
                Lixeira
              </h3>
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
              Esvaziar lixeira do sistema
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
              Em breve
            </p>
            <AnimatedButton
              disabled
              variant="secondary"
              size="md"
              className="w-full"
            >
              Esvaziar
            </AnimatedButton>
          </InteractiveCard>

          {/* Downloads Antigos Card */}
          <InteractiveCard className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <FolderOpen className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <h3 className="text-base font-medium text-[var(--color-text-primary)]">
                Downloads Antigos
              </h3>
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
              Remover arquivos de download antigos
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
              Em breve
            </p>
            <AnimatedButton
              disabled
              variant="secondary"
              size="md"
              className="w-full"
            >
              Analisar
            </AnimatedButton>
          </InteractiveCard>
        </div>
      </motion.div>

      {/* Dialog de Seleção */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogClose onClick={() => setIsDialogOpen(false)} />
          <DialogHeader>
            <DialogTitle>
              {deleteComplete ? 'Limpeza Concluída!' : 'Selecione os Arquivos para Remover'}
            </DialogTitle>
            <DialogDescription>
              {deleteComplete
                ? `${formatBytes(deletedSize)} foram liberados com sucesso`
                : 'Escolha quais arquivos temporários você deseja deletar'
              }
            </DialogDescription>
          </DialogHeader>

          {isScanning ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingState
                type="spinner"
                size="lg"
                message="Escaneando arquivos temporários..."
              />
            </div>
          ) : deleteComplete ? (
            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className="flex flex-col items-center justify-center py-12 space-y-6"
            >
              <CheckCircle2 className="w-16 h-16 text-[var(--color-success)]" />
              <StatDisplay
                label="Espaço Liberado"
                value={formatBytes(deletedSize)}
                size="lg"
                mono={true}
              />
            </motion.div>
          ) : (
            <>
              <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-[var(--color-border-default)]">
                <p className="text-[var(--color-text-secondary)] text-xs">
                  {Object.keys(groupedFiles).length} categorias encontradas
                </p>
                <button
                  onClick={() => {
                    const allCollapsed = collapsedCategories.size === Object.keys(groupedFiles).length;
                    setCollapsedCategories(allCollapsed ? new Set() : new Set(Object.keys(groupedFiles)));
                  }}
                  className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-[var(--transition-fast)]"
                >
                  {collapsedCategories.size === Object.keys(groupedFiles).length ? 'Expandir Todas' : 'Colapsar Todas'}
                </button>
              </div>
              <div className="overflow-y-auto max-h-[400px] px-6 py-4 space-y-4">
                {Object.entries(groupedFiles).map(([category, files], index) => {
                  const categorySize = files.reduce((sum, f) => sum + f.size, 0);
                  const allSelected = files.every(f => selectedFiles.has(f.path));
                  const isCollapsed = collapsedCategories.has(category);
                  const categoryRootPath = files[0]?.root_path || '';

                  return (
                    <div key={category} className="space-y-2">
                      {index > 0 && (
                        <div className="border-t border-[var(--color-border-default)] pt-4" />
                      )}
                      <div className="flex items-start gap-2 p-3 rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-colors duration-[var(--transition-base)] bg-[var(--color-bg-base)]">
                        <motion.button
                          onClick={() => toggleCollapse(category)}
                          className="p-1 hover:bg-[var(--color-bg-elevated)] rounded transition-colors duration-[var(--transition-fast)] mt-0.5"
                          aria-label={isCollapsed ? 'Expandir categoria' : 'Colapsar categoria'}
                          whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                          whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                        >
                          <motion.div
                            animate={{ rotate: isCollapsed ? 0 : 90 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                          >
                            <ChevronRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
                          </motion.div>
                        </motion.button>
                        <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[var(--color-text-primary)] text-sm font-medium">{category}</p>
                            <p className="text-[var(--color-text-tertiary)] text-xs">{files.length} itens</p>
                          </div>
                        </label>
                        <div className="flex items-center gap-2">
                          <StatDisplay
                            label=""
                            value={formatBytes(categorySize)}
                            size="sm"
                            mono={true}
                            className="items-end"
                          />
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenFolder(categoryRootPath);
                            }}
                            className="p-2 hover:bg-[var(--color-bg-elevated)] rounded transition-colors duration-[var(--transition-fast)] group"
                            aria-label="Abrir local"
                            whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                            whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                            title="Abrir Local"
                          >
                            <ExternalLink className="w-4 h-4 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-colors duration-[var(--transition-fast)]" />
                          </motion.button>
                        </div>
                      </div>

                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: shouldReduceMotion ? 1 : 0, height: shouldReduceMotion ? 'auto' : 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: shouldReduceMotion ? 1 : 0, height: shouldReduceMotion ? 'auto' : 0 }}
                          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                          className="ml-7 space-y-1 overflow-hidden"
                        >
                          {files.map((file) => (
                            <label
                              key={file.path}
                              className="flex items-center gap-3 p-2 hover:bg-[#0f0f0f] rounded cursor-pointer transition-colors duration-150"
                            >
                              <Checkbox
                                checked={selectedFiles.has(file.path)}
                                onCheckedChange={() => toggleFile(file.path)}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-[var(--color-text-secondary)] text-xs truncate">{file.name}</p>
                              </div>
                              <span className="text-[var(--color-text-tertiary)] text-xs font-mono">
                                {formatBytes(file.size)}
                              </span>
                            </label>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {isDeleting && (
                <div className="px-6 py-4">
                  <LoadingState
                    type="progress"
                    progress={deleteProgress}
                    message="Deletando arquivos..."
                    size="md"
                  />
                </div>
              )}
            </>
          )}

          {!isScanning && (
            <DialogFooter>
              {deleteComplete ? (
                <AnimatedButton
                  onClick={() => {
                    setIsDialogOpen(false);
                    setScanResult(null);
                    setSelectedFiles(new Set());
                    setDeleteProgress(0);
                    setDeleteComplete(false);
                    setDeletedSize(0);
                  }}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Fechar
                </AnimatedButton>
              ) : (
                <div className="flex items-center justify-between w-full gap-4">
                  <div className="flex flex-col gap-1">
                    <StatDisplay
                      label="Selecionado"
                      value={formatBytes(getSelectedSize())}
                      size="sm"
                      mono={true}
                    />
                    <span className="text-[var(--color-text-tertiary)] text-xs">
                      {selectedFiles.size} {selectedFiles.size === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <AnimatedButton
                      variant="outline"
                      size="md"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancelar
                    </AnimatedButton>
                    <AnimatedButton
                      variant="primary"
                      size="md"
                      onClick={handleDelete}
                      disabled={selectedFiles.size === 0 || isDeleting}
                      loading={isDeleting}
                      icon={!isDeleting ? <Trash2 className="w-4 h-4" /> : undefined}
                    >
                      {isDeleting ? 'Deletando...' : 'Deletar Selecionados'}
                    </AnimatedButton>
                  </div>
                </div>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
