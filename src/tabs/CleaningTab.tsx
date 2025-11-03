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
      transition={{ duration: 0.2 }}
      className="space-y-6 md:space-y-8"
    >
      <h2 className="text-xl md:text-2xl font-medium text-neutral-200 tracking-tight">Limpeza do Sistema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Arquivos Temporários Card */}
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
              <Trash2 className="w-4 h-4 text-neutral-400" />
              Arquivos Temporários
            </CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Limpar cache e arquivos temporários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400 text-sm">2.4 GB disponíveis para limpeza</p>
          </CardContent>
          <CardFooter>
            <Button>Limpar Agora</Button>
          </CardFooter>
        </Card>

        {/* Lixeira Card */}
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
              <Trash className="w-4 h-4 text-neutral-400" />
              Lixeira
            </CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Esvaziar lixeira do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400 text-sm">156 MB na lixeira</p>
          </CardContent>
          <CardFooter>
            <Button>Esvaziar</Button>
          </CardFooter>
        </Card>

        {/* Downloads Antigos Card */}
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
              <FolderOpen className="w-4 h-4 text-neutral-400" />
              Downloads Antigos
            </CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Remover arquivos de download antigos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400 text-sm">Analisar arquivos com mais de 30 dias</p>
          </CardContent>
          <CardFooter>
            <Button>Analisar</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
