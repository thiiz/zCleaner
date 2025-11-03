import { motion } from 'framer-motion';
import { Monitor, HardDrive, Cpu, MemoryStick } from 'lucide-react';
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

export default function SystemTab() {
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
        Informações do Sistema
      </h2>
      
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
          
          <div className="space-y-[var(--spacing-md)] mb-[var(--spacing-lg)]">
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-[var(--color-text-tertiary)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                CPU: Intel Core i7
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MemoryStick className="w-4 h-4 text-[var(--color-text-tertiary)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                RAM: 16 GB
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Monitor className="w-4 h-4 text-[var(--color-text-tertiary)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                SO: Windows 11 Pro
              </span>
            </div>
          </div>
          
          <div className="mt-auto">
            <AnimatedButton
              variant="secondary"
              size="md"
              className="w-full"
              icon={<Monitor className="w-4 h-4" />}
            >
              Ver Detalhes
            </AnimatedButton>
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
          
          <div className="space-y-[var(--spacing-md)] mb-[var(--spacing-lg)]">
            <StatDisplay
              label="Capacidade Total"
              value={512}
              unit="GB"
              size="md"
              mono={true}
            />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                SSD: Saudável
              </span>
            </div>
          </div>
          
          <div className="mt-auto">
            <AnimatedButton
              variant="secondary"
              size="md"
              className="w-full"
              icon={<HardDrive className="w-4 h-4" />}
            >
              Verificar Disco
            </AnimatedButton>
          </div>
        </InteractiveCard>
      </div>
    </motion.div>
  );
}
