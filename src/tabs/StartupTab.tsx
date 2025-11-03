import { motion } from 'framer-motion';
import { Power, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function StartupTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 md:space-y-8"
    >
      <h2 className="text-xl md:text-2xl font-medium text-neutral-200 tracking-tight">Gerenciamento de Inicialização</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Programas de Inicialização Card */}
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
              <Power className="w-4 h-4 text-neutral-400" />
              Programas de Inicialização
            </CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Gerenciar apps que iniciam com o Windows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400 text-sm">12 programas habilitados</p>
          </CardContent>
          <CardFooter>
            <Button>Gerenciar</Button>
          </CardFooter>
        </Card>

        {/* Tempo de Inicialização Card */}
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
              <Clock className="w-4 h-4 text-neutral-400" />
              Tempo de Inicialização
            </CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Análise do tempo de boot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400 text-sm">Último boot: 28 segundos</p>
          </CardContent>
          <CardFooter>
            <Button>Ver Detalhes</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
