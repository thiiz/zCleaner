import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, MemoryStick, HardDrive, Activity, Zap, RefreshCw, TrendingUp, Monitor, Trash2, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { InteractiveCard } from '@/components/InteractiveCard';
import { AnimatedButton } from '@/components/AnimatedButton';
import { LoadingState } from '@/components/LoadingState';
import StatDisplay from '@/components/StatDisplay';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSystemInfo } from '@/hooks/useSystemInfo';
import { formatBytes, formatBytesToGB, formatBytesAuto, formatBytesUnit } from '@/lib/formatBytes';

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

export default function Dashboard() {
  const shouldReduceMotion = useReducedMotion();
  const { systemInfo, diskInfo, loading, error, refetch } = useSystemInfo();

  const totalDiskSpace = diskInfo.reduce((acc, disk) => acc + disk.total_space, 0);
  const availableDiskSpace = diskInfo.reduce((acc, disk) => acc + disk.available_space, 0);
  const usedDiskSpace = totalDiskSpace - availableDiskSpace;
  const diskUsagePercent = totalDiskSpace > 0 ? (usedDiskSpace / totalDiskSpace) * 100 : 0;
  const memoryUsagePercent = systemInfo ? (systemInfo.used_memory / systemInfo.total_memory) * 100 : 0;

  // Estados para limpeza de arquivos temporários
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deleteComplete, setDeleteComplete] = useState(false);
  const [deletedSize, setDeletedSize] = useState(0);

  // Estados para otimização de memória
  const [isOptimizingMemory, setIsOptimizingMemory] = useState(false);
  const [memoryOptimized, setMemoryOptimized] = useState(false);
  const [memoryFreed, setMemoryFreed] = useState(0);

  const handleScan = async () => {
    setIsScanning(true);
    setIsDialogOpen(true);
    setDeleteComplete(false);

    try {
      const result = await invoke<ScanResult>('scan_temp_files');
      setScanResult(result);
      setSelectedFiles(new Set(result.files.map(f => f.path)));
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

  const handleOptimizeMemory = async () => {
    setIsOptimizingMemory(true);
    setMemoryOptimized(false);
    
    try {
      const result = await invoke<{ 
        before_used: number; 
        after_used: number; 
        freed: number; 
        success: boolean;
        message: string;
        is_admin: boolean;
      }>('optimize_memory');
      
      setMemoryFreed(result.freed);
      setMemoryOptimized(result.success);
      
      if (!result.is_admin) {
        console.warn('⚠️ Rodando sem privilégios administrativos - eficiência limitada');
      }
      
      if (!result.success) {
        console.warn('Otimização parcial:', result.message);
      } else {
        console.log('✓', result.message);
      }
      
      // Atualizar informações do sistema após otimização
      setTimeout(() => {
        refetch();
      }, 1000);
      
      // Resetar estado após 5 segundos
      setTimeout(() => {
        setMemoryOptimized(false);
        setMemoryFreed(0);
      }, 5000);
    } catch (error) {
      console.error('Erro ao otimizar memória:', error);
    } finally {
      setIsOptimizingMemory(false);
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
        className="space-y-[var(--spacing-lg)] lg:space-y-[var(--spacing-xl)] pb-[var(--padding-mobile)] lg:pb-[var(--padding-desktop)]"
      >
        {/* Header com ações rápidas */}
        <div className="flex items-center justify-between">
          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={refetch}
            disabled={loading}
            icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          >
            Atualizar
          </AnimatedButton>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Métricas principais em destaque */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InteractiveCard className="relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Cpu className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-tertiary)]">CPU</p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {systemInfo?.cpu_cores || 0} núcleos
                  </p>
                </div>
              </div>
              <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
            </div>
            {loading ? (
              <div className="h-8 bg-[var(--color-border)] animate-pulse rounded" />
            ) : (
              <p className="text-xs text-[var(--color-text-secondary)] truncate">
                {systemInfo?.cpu_name || 'N/A'}
              </p>
            )}
          </InteractiveCard>

          <InteractiveCard className="relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <MemoryStick className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-tertiary)]">RAM</p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {systemInfo ? `${formatBytesToGB(systemInfo.used_memory)} GB` : '0 GB'}
                  </p>
                </div>
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded ${memoryUsagePercent > 80 ? 'bg-red-500/10 text-red-500' :
                  memoryUsagePercent > 60 ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                }`}>
                {Math.round(memoryUsagePercent)}%
              </div>
            </div>
            {loading ? (
              <div className="space-y-1">
                <div className="h-2 bg-[var(--color-border)] animate-pulse rounded-full" />
                <div className="h-3 bg-[var(--color-border)] animate-pulse rounded w-24" />
              </div>
            ) : (
              <>
                <div className="relative h-2 bg-[var(--color-border)] rounded-full overflow-hidden mb-1">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${memoryUsagePercent > 80 ? 'bg-red-500' :
                        memoryUsagePercent > 60 ? 'bg-yellow-500' :
                          'bg-purple-500'
                      }`}
                    style={{ width: `${memoryUsagePercent}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  de {systemInfo ? formatBytesToGB(systemInfo.total_memory) : 0} GB total
                </p>
              </>
            )}
          </InteractiveCard>

          <InteractiveCard className="relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <HardDrive className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-tertiary)]">Disco</p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {formatBytesAuto(usedDiskSpace)} {formatBytesUnit(usedDiskSpace)}
                  </p>
                </div>
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded ${diskUsagePercent > 90 ? 'bg-red-500/10 text-red-500' :
                  diskUsagePercent > 75 ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                }`}>
                {Math.round(diskUsagePercent)}%
              </div>
            </div>
            {loading ? (
              <div className="space-y-1">
                <div className="h-2 bg-[var(--color-border)] animate-pulse rounded-full" />
                <div className="h-3 bg-[var(--color-border)] animate-pulse rounded w-24" />
              </div>
            ) : (
              <>
                <div className="relative h-2 bg-[var(--color-border)] rounded-full overflow-hidden mb-1">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${diskUsagePercent > 90 ? 'bg-red-500' :
                        diskUsagePercent > 75 ? 'bg-yellow-500' :
                          'bg-green-500'
                      }`}
                    style={{ width: `${diskUsagePercent}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  de {formatBytesAuto(totalDiskSpace)} {formatBytesUnit(totalDiskSpace)} total
                </p>
              </>
            )}
          </InteractiveCard>
        </div>

        {/* Informações detalhadas e ações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          {/* Detalhes do Sistema */}
          <InteractiveCard className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <h3 className="text-base font-medium text-[var(--color-text-primary)]">
                Informações do Sistema
              </h3>
            </div>

            {loading ? (
              <div className="space-y-3 flex-1">
                <div className="h-16 bg-[var(--color-border)] animate-pulse rounded" />
                <div className="h-16 bg-[var(--color-border)] animate-pulse rounded" />
              </div>
            ) : systemInfo ? (
              <div className="space-y-4 flex-1">
                <div className="p-3 bg-[var(--color-bg-secondary)] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[var(--color-text-tertiary)]">Memória</span>
                    <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                      {formatBytesToGB(systemInfo.used_memory)} / {formatBytesToGB(systemInfo.total_memory)} GB
                    </span>
                  </div>
                  <div className="relative h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${memoryUsagePercent}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-[var(--color-bg-secondary)] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[var(--color-text-tertiary)]">Armazenamento</span>
                    <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                      {formatBytesAuto(availableDiskSpace)} {formatBytesUnit(availableDiskSpace)} livre
                    </span>
                  </div>
                  <div className="relative h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${diskUsagePercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[var(--color-text-tertiary)]">Sistema Operacional</span>
                    <span className="text-[var(--color-text-secondary)]">
                      {systemInfo.os_name} {systemInfo.os_version}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--color-text-tertiary)]">Discos Detectados</span>
                    <span className="text-[var(--color-text-secondary)]">{diskInfo.length}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </InteractiveCard>

          {/* Ações Rápidas */}
          <InteractiveCard className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <h3 className="text-base font-medium text-[var(--color-text-primary)]">
                Ações Rápidas
              </h3>
            </div>

            <div className="space-y-3 flex-1">
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                      <MemoryStick className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        Otimizar Memória
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        {memoryOptimized 
                          ? `${formatBytes(memoryFreed)} liberados`
                          : 'Liberar RAM não utilizada'
                        }
                      </p>
                    </div>
                  </div>
                  <AnimatedButton 
                    variant={memoryOptimized ? "primary" : "secondary"}
                    size="sm"
                    onClick={handleOptimizeMemory}
                    disabled={isOptimizingMemory}
                    loading={isOptimizingMemory}
                    icon={memoryOptimized ? <CheckCircle2 className="w-4 h-4" /> : undefined}
                  >
                    {memoryOptimized ? 'Concluído' : isOptimizingMemory ? 'Otimizando...' : 'Executar'}
                  </AnimatedButton>
                </div>
              </div>

              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <Activity className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        Gerenciar Processos
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        Ver processos em execução
                      </p>
                    </div>
                  </div>
                  <AnimatedButton variant="secondary" size="sm">
                    Abrir
                  </AnimatedButton>
                </div>
              </div>

              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                      <Trash2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        Limpar Arquivos Temporários
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        Liberar espaço em disco
                      </p>
                    </div>
                  </div>
                  <AnimatedButton
                    variant="secondary"
                    size="sm"
                    onClick={handleScan}
                    disabled={isScanning}
                    loading={isScanning}
                  >
                    {isScanning ? 'Escaneando...' : 'Limpar'}
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </InteractiveCard>
        </div>

        {/* Status dos Discos */}
        {diskInfo.length > 0 && (
          <InteractiveCard>
            <div className="flex items-center gap-3 mb-4">
              <HardDrive className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <h3 className="text-base font-medium text-[var(--color-text-primary)]">
                Status dos Discos
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {diskInfo.map((disk, index) => {
                const diskPercent = (disk.total_space - disk.available_space) / disk.total_space * 100;
                const diskUsed = disk.total_space - disk.available_space;
                return (
                  <div key={index} className="p-3 bg-[var(--color-bg-secondary)] rounded-lg min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-medium text-[var(--color-text-primary)] truncate" title={disk.mount_point}>
                        {disk.mount_point}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${diskPercent > 90 ? 'bg-red-500/10 text-red-500' :
                          diskPercent > 75 ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                        }`}>
                        {Math.round(diskPercent)}%
                      </span>
                    </div>
                    <div className="relative h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden mb-2">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${diskPercent > 90 ? 'bg-red-500' :
                            diskPercent > 75 ? 'bg-yellow-500' :
                              'bg-green-500'
                          }`}
                        style={{ width: `${diskPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="text-[var(--color-text-tertiary)] truncate">
                        {formatBytes(diskUsed)} usado
                      </span>
                      <span className="text-[var(--color-text-tertiary)] flex-shrink-0">
                        {formatBytes(disk.total_space)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </InteractiveCard>
        )}

      </motion.div>

      {/* Dialog de Limpeza de Arquivos Temporários */}
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
