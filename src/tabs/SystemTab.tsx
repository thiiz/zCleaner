import { motion } from 'framer-motion';
import { Monitor, HardDrive, Cpu, MemoryStick, RefreshCw } from 'lucide-react';
import { InteractiveCard } from '@/components/enhanced/InteractiveCard';
import { AnimatedButton } from '@/components/enhanced/AnimatedButton';
import StatDisplay from '@/components/enhanced/StatDisplay';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSystemInfo } from '@/hooks/useSystemInfo';
import { formatBytes, formatBytesToGB } from '@/lib/formatBytes';

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

export default function SystemTab() {
  const shouldReduceMotion = useReducedMotion();
  const { systemInfo, diskInfo, loading, error, refetch } = useSystemInfo();

  const totalDiskSpace = diskInfo.reduce((acc, disk) => acc + disk.total_space, 0);
  const availableDiskSpace = diskInfo.reduce((acc, disk) => acc + disk.available_space, 0);
  const usedDiskSpace = totalDiskSpace - availableDiskSpace;
  const diskUsagePercent = totalDiskSpace > 0 ? (usedDiskSpace / totalDiskSpace) * 100 : 0;

  return (
    <motion.div
      variants={getPageVariants(shouldReduceMotion)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-[var(--spacing-lg)] lg:space-y-[var(--spacing-xl)]"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl lg:text-2xl font-medium text-[var(--color-text-primary)] tracking-tight">
          Informações do Sistema
        </h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 transition-all duration-[var(--transition-base)]">
        {/* Informações do Sistema Card */}
        <InteractiveCard className="flex flex-col">
          <div className="flex items-center gap-3 mb-[var(--spacing-sm)]">
            <Monitor className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="text-base font-medium text-[var(--color-text-primary)]">
              Informações do Sistema
            </h3>
          </div>

          <p className="text-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-md)]">
            Detalhes do hardware e SO
          </p>

          {loading ? (
            <div className="space-y-[var(--spacing-md)] flex-1">
              <div className="h-5 bg-[var(--color-border)] animate-pulse rounded" />
              <div className="h-5 bg-[var(--color-border)] animate-pulse rounded" />
              <div className="h-5 bg-[var(--color-border)] animate-pulse rounded" />
            </div>
          ) : systemInfo ? (
            <div className="space-y-3 flex-1">
              <div className="flex items-start gap-3">
                <Cpu className="w-4 h-4 text-[var(--color-text-tertiary)] mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--color-text-tertiary)] mb-0.5">CPU</p>
                  <p className="text-sm text-[var(--color-text-secondary)] truncate">
                    {systemInfo.cpu_name}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    {systemInfo.cpu_cores} núcleos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MemoryStick className="w-4 h-4 text-[var(--color-text-tertiary)] mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--color-text-tertiary)] mb-0.5">RAM</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {formatBytesToGB(systemInfo.total_memory)} GB
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    {formatBytesToGB(systemInfo.used_memory)} GB em uso
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Monitor className="w-4 h-4 text-[var(--color-text-tertiary)] mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--color-text-tertiary)] mb-0.5">Sistema</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {systemInfo.os_name} {systemInfo.os_version}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-auto">
            <StatDisplay
              label="Uso de Memória"
              value={systemInfo ? Math.round((systemInfo.used_memory / systemInfo.total_memory) * 100) : 0}
              unit="%"
              size="md"
              mono={true}
            />
          </div>
        </InteractiveCard>

        {/* Saúde do Disco Card */}
        <InteractiveCard className="flex flex-col">
          <div className="flex items-center gap-3 mb-[var(--spacing-sm)]">
            <HardDrive className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="text-base font-medium text-[var(--color-text-primary)]">
              Saúde do Disco
            </h3>
          </div>

          <p className="text-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-md)]">
            Status dos discos
          </p>

          {loading ? (
            <div className="space-y-3 flex-1">
              <div className="h-12 bg-[var(--color-border)] animate-pulse rounded" />
              <div className="h-5 bg-[var(--color-border)] animate-pulse rounded" />
            </div>
          ) : (
            <>
              <div className="space-y-3 flex-1">
                <StatDisplay
                  label="Capacidade Total"
                  value={formatBytesToGB(totalDiskSpace)}
                  unit="GB"
                  size="md"
                  mono={true}
                />
                <StatDisplay
                  label="Espaço Disponível"
                  value={formatBytesToGB(availableDiskSpace)}
                  unit="GB"
                  size="md"
                  mono={true}
                />
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${diskUsagePercent > 90 ? 'bg-red-500' :
                    diskUsagePercent > 75 ? 'bg-yellow-500' :
                      'bg-[var(--color-success)]'
                    }`} />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {diskUsagePercent > 90 ? 'Crítico' :
                      diskUsagePercent > 75 ? 'Atenção' :
                        'Saudável'} ({Math.round(diskUsagePercent)}% usado)
                  </span>
                </div>
              </div>

              {diskInfo.length > 0 && (
                <div className="pt-3 border-t border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-tertiary)] mb-2">
                    Discos detectados: {diskInfo.length}
                  </p>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {diskInfo.slice(0, 3).map((disk, index) => (
                      <div key={index} className="text-xs text-[var(--color-text-secondary)] truncate">
                        {disk.mount_point}: {formatBytes(disk.available_space)} livre
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </InteractiveCard>
      </div>
    </motion.div>
  );
}
