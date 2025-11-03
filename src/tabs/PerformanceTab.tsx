import { motion } from 'framer-motion';
import { MemoryStick, Activity, Database } from 'lucide-react';
import { InteractiveCard } from '@/components/enhanced/InteractiveCard';
import { AnimatedButton } from '@/components/enhanced/AnimatedButton';
import StatDisplay from '@/components/enhanced/StatDisplay';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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

export default function PerformanceTab() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={getPageVariants(shouldReduceMotion)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 lg:space-y-8"
    >
      <h2 className="text-xl lg:text-2xl font-medium text-[var(--color-text-primary)] tracking-tight">
        Otimização de Desempenho
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 transition-all duration-[var(--transition-base)]">
        {/* Otimização de RAM Card */}
        <InteractiveCard className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <MemoryStick className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="text-base font-medium text-[var(--color-text-primary)]">
              Otimização de RAM
            </h3>
          </div>
          <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
            Liberar memória não utilizada
          </p>
          <div className="mb-6 flex-1">
            <StatDisplay
              label="Memória em Uso"
              value="8.2 GB"
              unit="/ 16 GB"
              size="md"
              mono={true}
            />
          </div>
          <AnimatedButton
            variant="primary"
            size="md"
            className="w-full"
          >
            Otimizar
          </AnimatedButton>
        </InteractiveCard>

        {/* Processos em Segundo Plano Card */}
        <InteractiveCard className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="text-base font-medium text-[var(--color-text-primary)]">
              Processos em Segundo Plano
            </h3>
          </div>
          <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
            Gerenciar processos desnecessários
          </p>
          <div className="mb-6 flex-1">
            <StatDisplay
              label="Processos Ativos"
              value="47"
              size="md"
              mono={true}
            />
          </div>
          <AnimatedButton
            variant="primary"
            size="md"
            className="w-full"
          >
            Ver Processos
          </AnimatedButton>
        </InteractiveCard>

        {/* Cache de Sistema Card */}
        <InteractiveCard className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="text-base font-medium text-[var(--color-text-primary)]">
              Cache de Sistema
            </h3>
          </div>
          <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
            Limpar cache do sistema
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
            Otimizar cache para melhor desempenho
          </p>
          <AnimatedButton
            variant="primary"
            size="md"
            className="w-full"
          >
            Limpar Cache
          </AnimatedButton>
        </InteractiveCard>
      </div>
    </motion.div>
  );
}
