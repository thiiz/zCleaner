import { motion } from 'framer-motion';
import { MemoryStick, Activity, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PerformanceTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-6"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white">Otimização de Desempenho</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Otimização de RAM Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MemoryStick className="w-5 h-5 text-blue-500" />
              Otimização de RAM
            </CardTitle>
            <CardDescription className="text-gray-400">
              Liberar memória não utilizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">8.2 GB / 16 GB em uso</p>
          </CardContent>
          <CardFooter>
            <Button>Otimizar</Button>
          </CardFooter>
        </Card>

        {/* Processos em Segundo Plano Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-blue-500" />
              Processos em Segundo Plano
            </CardTitle>
            <CardDescription className="text-gray-400">
              Gerenciar processos desnecessários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">47 processos ativos</p>
          </CardContent>
          <CardFooter>
            <Button>Ver Processos</Button>
          </CardFooter>
        </Card>

        {/* Cache de Sistema Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="w-5 h-5 text-blue-500" />
              Cache de Sistema
            </CardTitle>
            <CardDescription className="text-gray-400">
              Limpar cache do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">Otimizar cache para melhor desempenho</p>
          </CardContent>
          <CardFooter>
            <Button>Limpar Cache</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
