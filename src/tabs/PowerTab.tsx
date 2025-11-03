import { motion } from 'framer-motion';
import { Zap, BatteryCharging } from 'lucide-react';
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

export default function PowerTab() {
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
        Configurações de Energia
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 transition-all duration-[var(--transition-base)]">
        {/* Plano de Energia Card */}
        <InteractiveCard className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="text-base font-medium text-[var(--color-text-primary)]">
              Plano de Energia
            </h3>
          </div>
          <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
            Configurar perfil de energia
          </p>
          <div className="mb-6 flex-1">
            <StatDisplay
              label="Plano Atual"
              value="Balanceado"
              size="sm"
              mono={false}
            />
          </div>
          <AnimatedButton
            variant="primary"
            size="md"
            className="w-full"
          >
            Alterar Plano
          </AnimatedButton>
        </InteractiveCard>

        {/* Economia de Bateria Card */}
        <InteractiveCard className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <BatteryCharging className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="text-base font-medium text-[var(--color-text-primary)]">
              Economia de Bateria
            </h3>
          </div>
          <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
            Ativar modo de economia
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
            Prolongar duração da bateria
          </p>
          <AnimatedButton
            variant="primary"
            size="md"
            className="w-full"
          >
            Ativar
          </AnimatedButton>
        </InteractiveCard>
      </div>
    </motion.div>
  );
}
