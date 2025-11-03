import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface SystemInfo {
  cpu_name: string;
  cpu_cores: number;
  total_memory: number;
  used_memory: number;
  os_name: string;
  os_version: string;
  kernel_version: string;
}

export interface DiskInfo {
  name: string;
  mount_point: string;
  total_space: number;
  available_space: number;
  is_removable: boolean;
  file_system: string;
}

export function useSystemInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [diskInfo, setDiskInfo] = useState<DiskInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [sysInfo, disks] = await Promise.all([
        invoke<SystemInfo>('get_system_info'),
        invoke<DiskInfo[]>('get_disk_info')
      ]);
      
      setSystemInfo(sysInfo);
      setDiskInfo(disks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao obter informações do sistema');
      console.error('Erro ao buscar informações do sistema:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  return { systemInfo, diskInfo, loading, error, refetch: fetchSystemInfo };
}
