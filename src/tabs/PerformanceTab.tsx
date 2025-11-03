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
      transition={{ duration: 0.2 }}
      className="space-y-6 md:space-y-8"
    >
      <h2 className="text-xl md:text-2xl font-medium text-neutral-200 tracking-tight">Otimização de Desempenho</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Otimização de RAM Card */}
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
              <MemoryStick className="w-4 h-4 text-neutral-400" />
              Otimização de RAM
            </CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Liberar memória não utilizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400 text-sm">8.2 GB / 16 GB em uso</p>
          </CardContent>
          <CardFooter>
            <Button>Otimizar</Button>
          </CardFooter>
        </Card>

        {/* Processos em Segundo Plano Card */}
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
              <Activity className="w-4 h-4 text-neutral-400" />
              Processos em Segundo Plano
            </CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Gerenciar processos desnecessários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400 text-sm">47 processos ativos</p>
          </CardContent>
          <CardFooter>
            <Button>Ver Processos</Button>
          </CardFooter>
        </Card>

        {/* Cache de Sistema Card */}
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
              <Database className="w-4 h-4 text-neutral-400" />
              Cache de Sistema
            </CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Limpar cache do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400 text-sm">Otimizar cache para melhor desempenho</p>
          </CardContent>
          <CardFooter>
            <Button>Limpar Cache</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
