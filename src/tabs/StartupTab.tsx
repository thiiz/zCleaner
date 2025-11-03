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
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-6"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white">Gerenciamento de Inicialização</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Programas de Inicialização Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Power className="w-5 h-5 text-blue-500" />
              Programas de Inicialização
            </CardTitle>
            <CardDescription className="text-gray-400">
              Gerenciar apps que iniciam com o Windows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">12 programas habilitados</p>
          </CardContent>
          <CardFooter>
            <Button>Gerenciar</Button>
          </CardFooter>
        </Card>

        {/* Tempo de Inicialização Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-blue-500" />
              Tempo de Inicialização
            </CardTitle>
            <CardDescription className="text-gray-400">
              Análise do tempo de boot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">Último boot: 28 segundos</p>
          </CardContent>
          <CardFooter>
            <Button>Ver Detalhes</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
