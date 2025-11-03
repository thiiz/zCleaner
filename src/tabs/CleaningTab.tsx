import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Trash, FolderOpen, Loader2, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

interface TempFile {
  path: string;
  name: string;
  size: number;
  category: string;
}

interface ScanResult {
  files: TempFile[];
  total_size: number;
}

export default function CleaningTab() {
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="space-y-6 md:space-y-8"
      >
        <h2 className="text-xl md:text-2xl font-medium text-neutral-200 tracking-tight">Limpeza do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* Arquivos Temporários Card */}
          <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a] transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
                <Trash2 className="w-4 h-4 text-neutral-400" />
                Arquivos Temporários
              </CardTitle>
              <CardDescription className="text-neutral-500 text-sm">
                Limpar cache e arquivos temporários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400 text-sm">
                Escaneie para ver quanto espaço pode ser liberado
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleScan} disabled={isScanning}>
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Escaneando...
                  </>
                ) : (
                  'Escanear Agora'
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Lixeira Card */}
          <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a] transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
                <Trash className="w-4 h-4 text-neutral-400" />
                Lixeira
              </CardTitle>
              <CardDescription className="text-neutral-500 text-sm">
                Esvaziar lixeira do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400 text-sm">Em breve</p>
            </CardContent>
            <CardFooter>
              <Button disabled>Esvaziar</Button>
            </CardFooter>
          </Card>

          {/* Downloads Antigos Card */}
          <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a] transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
                <FolderOpen className="w-4 h-4 text-neutral-400" />
                Downloads Antigos
              </CardTitle>
              <CardDescription className="text-neutral-500 text-sm">
                Remover arquivos de download antigos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400 text-sm">Em breve</p>
            </CardContent>
            <CardFooter>
              <Button disabled>Analisar</Button>
            </CardFooter>
          </Card>
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
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-12 h-12 text-neutral-400 animate-spin" />
              <p className="text-neutral-400 text-sm">Escaneando arquivos temporários...</p>
            </div>
          ) : deleteComplete ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <p className="text-neutral-200 text-lg font-medium">
                {formatBytes(deletedSize)} liberados
              </p>
            </div>
          ) : (
            <>
              <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-[#1f1f1f]">
                <p className="text-neutral-400 text-xs">
                  {Object.keys(groupedFiles).length} categorias encontradas
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCollapsedCategories(new Set())}
                    className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    Expandir Todas
                  </button>
                  <span className="text-neutral-600">|</span>
                  <button
                    onClick={() => setCollapsedCategories(new Set(Object.keys(groupedFiles)))}
                    className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    Colapsar Todas
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto max-h-[400px] px-6 py-4 space-y-3">
                {Object.entries(groupedFiles).map(([category, files]) => {
                  const categorySize = files.reduce((sum, f) => sum + f.size, 0);
                  const allSelected = files.every(f => selectedFiles.has(f.path));
                  const isCollapsed = collapsedCategories.has(category);

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center gap-2 p-3 bg-[#0f0f0f] rounded-lg border border-[#1f1f1f] hover:border-[#2a2a2a] transition-colors">
                        <button
                          onClick={() => toggleCollapse(category)}
                          className="p-1 hover:bg-[#1f1f1f] rounded transition-colors"
                          aria-label={isCollapsed ? 'Expandir categoria' : 'Colapsar categoria'}
                        >
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-neutral-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-neutral-400" />
                          )}
                        </button>
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <div className="flex-1">
                            <p className="text-neutral-200 text-sm font-medium">{category}</p>
                            <p className="text-neutral-500 text-xs">{files.length} itens</p>
                          </div>
                          <span className="text-neutral-400 text-sm font-mono">
                            {formatBytes(categorySize)}
                          </span>
                        </label>
                      </div>

                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-7 space-y-1 overflow-hidden"
                        >
                          {files.map((file) => (
                            <label
                              key={file.path}
                              className="flex items-center gap-3 p-2 hover:bg-[#0f0f0f] rounded cursor-pointer transition-colors"
                            >
                              <Checkbox
                                checked={selectedFiles.has(file.path)}
                                onCheckedChange={() => toggleFile(file.path)}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-neutral-300 text-xs truncate">{file.name}</p>
                              </div>
                              <span className="text-neutral-500 text-xs font-mono">
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
                <div className="px-6 py-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Deletando arquivos...</span>
                    <span className="text-neutral-300 font-mono">{deleteProgress}%</span>
                  </div>
                  <Progress value={deleteProgress} />
                </div>
              )}
            </>
          )}

          {!isScanning && (
            <DialogFooter>
              {deleteComplete ? (
                <Button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setScanResult(null);
                    setSelectedFiles(new Set());
                    setDeleteProgress(0);
                    setDeleteComplete(false);
                    setDeletedSize(0);
                  }}
                  className="w-full"
                >
                  Fechar
                </Button>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm">
                    <span className="text-neutral-400">Selecionado: </span>
                    <span className="text-neutral-200 font-medium">
                      {formatBytes(getSelectedSize())}
                    </span>
                    <span className="text-neutral-500 ml-2">
                      ({selectedFiles.size} itens)
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleDelete}
                      disabled={selectedFiles.size === 0 || isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deletando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Deletar Selecionados
                        </>
                      )}
                    </Button>
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
