import { motion } from 'framer-motion';
import { Power, Clock } from 'lucide-react';
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

export default function StartupTab() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={getPageVariants(shouldReduceMotion)}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-[var(--spacing-lg)] lg:space-y-[var(--spacing-xl)]"
    >
      <h2 className="text-xl lg:text-2xl font-medium text-[var(--color-text-primary)] tracking-tight">
        Gerenciamento de Inicialização
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 transition-all duration-[var(--transition-base)]">
        {/* Programas de Inicialização Card */}
        <InteractiveCard className="flex flex-col">
          <div className="flex items-center gap-3 mb-[var(--spacing-sm)]">
            <Power className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="text-base font-medium text-[var(--color-text-primary)]">
              Programas de Inicialização
            </h3>
          </div>
          
          <p className="text-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-md)]">
            Gerenciar apps que iniciam com o Windows
          </p>
          
          <div className="mb-[var(--spacing-lg)]">
            <StatDisplay
              label="Programas habilitados"
              value={12}
              size="md"
              mono={true}
            />
          </div>
          
          <div className="mt-auto">
            <AnimatedButton
              variant="secondary"
              size="md"
              className="w-full"
              icon={<Power className="w-4 h-4" />}
            >
              Gerenciar
            </AnimatedButton>
          </div>
        </InteractiveCard>

        {/* Tempo de Inicialização Card */}
        <InteractiveCard className="flex flex-col">
          <div className="flex items-center gap-3 mb-[var(--spacing-sm)]">
            <Clock className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="text-base font-medium text-[var(--color-text-primary)]">
              Tempo de Inicialização
            </h3>
          </div>
          
          <p className="text-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-md)]">
            Análise do tempo de boot
          </p>
          
          <div className="mb-[var(--spacing-lg)]">
            <StatDisplay
              label="Último boot"
              value={28}
              unit="segundos"
              size="md"
              mono={true}
            />
          </div>
          
          <div className="mt-auto">
            <AnimatedButton
              variant="secondary"
              size="md"
              className="w-full"
              icon={<Clock className="w-4 h-4" />}
            >
              Ver Detalhes
            </AnimatedButton>
          </div>
        </InteractiveCard>
      </div>
    </motion.div>
  );
}
