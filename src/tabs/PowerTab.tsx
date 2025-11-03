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
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-6"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white">Configurações de Energia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Plano de Energia Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5 text-blue-500" />
              Plano de Energia
            </CardTitle>
            <CardDescription className="text-gray-400">
              Configurar perfil de energia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">Plano atual: Balanceado</p>
          </CardContent>
          <CardFooter>
            <Button>Alterar Plano</Button>
          </CardFooter>
        </Card>

        {/* Economia de Bateria Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BatteryCharging className="w-5 h-5 text-blue-500" />
              Economia de Bateria
            </CardTitle>
            <CardDescription className="text-gray-400">
              Ativar modo de economia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">Prolongar duração da bateria</p>
          </CardContent>
          <CardFooter>
            <Button>Ativar</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
