import { motion } from 'framer-motion';
import { Zap, BatteryCharging } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PowerTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 md:space-y-8"
    >
      <h2 className="text-xl md:text-2xl font-medium text-neutral-200 tracking-tight">Configurações de Energia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Plano de Energia Card */}
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
              <Zap className="w-4 h-4 text-neutral-400" />
              Plano de Energia
            </CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Configurar perfil de energia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400 text-sm">Plano atual: Balanceado</p>
          </CardContent>
          <CardFooter>
            <Button>Alterar Plano</Button>
          </CardFooter>
        </Card>

        {/* Economia de Bateria Card */}
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
              <BatteryCharging className="w-4 h-4 text-neutral-400" />
              Economia de Bateria
            </CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Ativar modo de economia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400 text-sm">Prolongar duração da bateria</p>
          </CardContent>
          <CardFooter>
            <Button>Ativar</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
