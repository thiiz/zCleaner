import { motion } from 'framer-motion';
import { Monitor, HardDrive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SystemTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 md:space-y-8"
    >
      <h2 className="text-xl md:text-2xl font-medium text-neutral-200 tracking-tight">Informações do Sistema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Informações do Sistema Card */}
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
              <Monitor className="w-4 h-4 text-neutral-400" />
              Informações do Sistema
            </CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Detalhes do hardware e SO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-neutral-400 text-sm">CPU: Intel Core i7</p>
              <p className="text-neutral-400 text-sm">RAM: 16 GB</p>
              <p className="text-neutral-400 text-sm">SO: Windows 11 Pro</p>
            </div>
          </CardContent>
        </Card>

        {/* Saúde do Disco Card */}
        <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-neutral-200 text-base font-medium">
              <HardDrive className="w-4 h-4 text-neutral-400" />
              Saúde do Disco
            </CardTitle>
            <CardDescription className="text-neutral-500 text-sm">
              Status dos discos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-400 text-sm">SSD: Saudável (512 GB)</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
