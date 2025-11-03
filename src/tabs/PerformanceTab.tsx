import { motion } from 'framer-motion';
import { Cpu, MemoryStick, HardDrive, Activity, Zap, RefreshCw, TrendingUp, Monitor } from 'lucide-react';
import { InteractiveCard } from '@/components/enhanced/InteractiveCard';
import { AnimatedButton } from '@/components/enhanced/AnimatedButton';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSystemInfo } from '@/hooks/useSystemInfo';
import { formatBytes, formatBytesToGB, formatBytesAuto, formatBytesUnit } from '@/lib/formatBytes';

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

export default function PerformanceTab() {
  const shouldReduceMotion = useReducedMotion();
  const { systemInfo, diskInfo, loading, error, refetch } = useSystemInfo();

  const totalDiskSpace = diskInfo.reduce((acc, disk) => acc + disk.total_space, 0);
  const availableDiskSpace = diskInfo.reduce((acc, disk) => acc + disk.available_space, 0);
  const usedDiskSpace = totalDiskSpace - availableDiskSpace;
  const diskUsagePercent = totalDiskSpace > 0 ? (usedDiskSpace / totalDiskSpace) * 100 : 0;
  const memoryUsagePercent = systemInfo ? (systemInfo.used_memory / systemInfo.total_memory) * 100 : 0;

  return (
    <motion.div
      variants={getPageVariants(shouldReduceMotion)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-[var(--spacing-lg)] lg:space-y-[var(--spacing-xl)]"
    >
      {/* Header com ações rápidas */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-medium text-[var(--color-text-primary)] tracking-tight">
            Dashboard de Desempenho
          </h2>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
            Monitoramento em tempo real do sistema
          </p>
        </div>
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
            <div className={`text-xs font-medium px-2 py-1 rounded ${
              memoryUsagePercent > 80 ? 'bg-red-500/10 text-red-500' :
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
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                    memoryUsagePercent > 80 ? 'bg-red-500' :
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
            <div className={`text-xs font-medium px-2 py-1 rounded ${
              diskUsagePercent > 90 ? 'bg-red-500/10 text-red-500' :
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
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                    diskUsagePercent > 90 ? 'bg-red-500' :
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
            <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer group">
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
                      Liberar RAM não utilizada
                    </p>
                  </div>
                </div>
                <AnimatedButton variant="secondary" size="sm">
                  Executar
                </AnimatedButton>
              </div>
            </div>

            <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer group">
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

            <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <HardDrive className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      Limpar Disco
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      Remover arquivos temporários
                    </p>
                  </div>
                </div>
                <AnimatedButton variant="secondary" size="sm">
                  Limpar
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
                    <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
                      diskPercent > 90 ? 'bg-red-500/10 text-red-500' :
                      diskPercent > 75 ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                    }`}>
                      {Math.round(diskPercent)}%
                    </span>
                  </div>
                  <div className="relative h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden mb-2">
                    <div 
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        diskPercent > 90 ? 'bg-red-500' :
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
  );
}
