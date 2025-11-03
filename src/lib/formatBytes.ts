export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatBytesToGB(bytes: number): number {
  return Math.round((bytes / (1024 ** 3)) * 10) / 10;
}

export function formatBytesAuto(bytes: number): string {
  if (bytes === 0) return '0';
  
  const k = 1024;
  const tb = bytes / (k ** 4);
  const gb = bytes / (k ** 3);
  
  // Se for maior que 1000 GB, mostrar em TB
  if (gb >= 1000) {
    return `${Math.round(tb * 10) / 10}`;
  }
  
  // Caso contrário, mostrar em GB
  return `${Math.round(gb * 10) / 10}`;
}

export function formatBytesUnit(bytes: number): string {
  if (bytes === 0) return 'GB';
  
  const k = 1024;
  const gb = bytes / (k ** 3);
  
  return gb >= 1000 ? 'TB' : 'GB';
}
