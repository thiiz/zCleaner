import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { RefreshCw, X, Search, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ToastContainer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

interface ProcessInfo {
  pid: number;
  name: string;
  cpu_usage: number;
  memory: number;
  disk_usage: number;
  status: string;
}

type SortField = 'name' | 'cpu_usage' | 'memory' | 'disk_usage';
type SortOrder = 'asc' | 'desc';

interface ProcessManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProcessManager({ open, onOpenChange }: ProcessManagerProps) {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('cpu_usage');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const { showToast } = useToast();

  const loadProcesses = async () => {
    setLoading(true);
    try {
      const result = await invoke<ProcessInfo[]>('get_processes');
      setProcesses(result);
    } catch (error) {
      showToast(`Erro ao carregar processos: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadProcesses();
      const interval = setInterval(loadProcesses, 3000);
      return () => clearInterval(interval);
    }
  }, [open]);

  const handleKillProcess = async (pid: number, name: string) => {
    if (!confirm(`Deseja encerrar o processo "${name}"?`)) return;
    
    try {
      await invoke('kill_process', { pid });
      showToast(`Processo "${name}" encerrado com sucesso`, 'success');
      loadProcesses();
    } catch (error) {
      showToast(`Erro ao encerrar processo: ${error}`, 'error');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedProcesses = processes
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortField === 'name') {
        return multiplier * a.name.localeCompare(b.name);
      }
      return multiplier * (a[sortField] - b[sortField]);
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogClose onClick={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Gerenciar Processos</DialogTitle>
          <DialogDescription>
            {processes.length} processos em execução
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar processo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={loadProcesses}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white text-sm rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden flex-1">
            <div className="overflow-auto max-h-[calc(80vh-200px)]">
              <table className="w-full">
                <thead className="bg-[#0f0f0f] border-b border-gray-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Nome
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-gray-400">PID</th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort('cpu_usage')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        CPU
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort('memory')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Memória
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort('disk_usage')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Disco
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-gray-400">Status</th>
                    <th className="px-4 py-3 text-right text-sm text-gray-400">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredAndSortedProcesses.map((process) => (
                      <motion.tr
                        key={process.pid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-gray-800 hover:bg-[#0f0f0f] transition-colors"
                      >
                        <td className="px-4 py-2 text-white text-sm font-medium">{process.name}</td>
                        <td className="px-4 py-2 text-gray-400 text-sm">{process.pid}</td>
                        <td className="px-4 py-2">
                          <span className={`text-sm ${
                            process.cpu_usage > 50 ? 'text-red-400' :
                            process.cpu_usage > 20 ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {process.cpu_usage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-400 text-sm">{formatBytes(process.memory)}</td>
                        <td className="px-4 py-2 text-gray-400 text-sm">{formatBytes(process.disk_usage)}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            process.status === 'Executando' ? 'bg-green-900/30 text-green-400' :
                            'bg-gray-800 text-gray-400'
                          }`}>
                            {process.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => handleKillProcess(process.pid, process.name)}
                            className="p-1.5 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded transition-colors"
                            title="Encerrar processo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
