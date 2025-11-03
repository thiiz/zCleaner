import { motion } from 'framer-motion';
import { Trash2, Trash, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CleaningTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-6"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white">Limpeza do Sistema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Arquivos Temporários Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trash2 className="w-5 h-5 text-blue-500" />
              Arquivos Temporários
            </CardTitle>
            <CardDescription className="text-gray-400">
              Limpar cache e arquivos temporários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">2.4 GB disponíveis para limpeza</p>
          </CardContent>
          <CardFooter>
            <Button>Limpar Agora</Button>
          </CardFooter>
        </Card>

        {/* Lixeira Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trash className="w-5 h-5 text-blue-500" />
              Lixeira
            </CardTitle>
            <CardDescription className="text-gray-400">
              Esvaziar lixeira do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">156 MB na lixeira</p>
          </CardContent>
          <CardFooter>
            <Button>Esvaziar</Button>
          </CardFooter>
        </Card>

        {/* Downloads Antigos Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FolderOpen className="w-5 h-5 text-blue-500" />
              Downloads Antigos
            </CardTitle>
            <CardDescription className="text-gray-400">
              Remover arquivos de download antigos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">Analisar arquivos com mais de 30 dias</p>
          </CardContent>
          <CardFooter>
            <Button>Analisar</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
