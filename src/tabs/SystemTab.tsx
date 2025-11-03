import { motion } from 'framer-motion';
import { Monitor, HardDrive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SystemTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-6"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white">Informações do Sistema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Informações do Sistema Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Monitor className="w-5 h-5 text-blue-500" />
              Informações do Sistema
            </CardTitle>
            <CardDescription className="text-gray-400">
              Detalhes do hardware e SO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">CPU: Intel Core i7</p>
              <p className="text-gray-300 text-sm">RAM: 16 GB</p>
              <p className="text-gray-300 text-sm">SO: Windows 11 Pro</p>
            </div>
          </CardContent>
        </Card>

        {/* Saúde do Disco Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <HardDrive className="w-5 h-5 text-blue-500" />
              Saúde do Disco
            </CardTitle>
            <CardDescription className="text-gray-400">
              Status dos discos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm">SSD: Saudável (512 GB)</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
