// Types for Temp Files feature
export interface TempFile {
  path: string;
  name: string;
  size: number;
  category: string;
}

export interface ScanResult {
  files: TempFile[];
  total_size: number;
}

export type CleaningState = 'idle' | 'scanning' | 'selecting' | 'deleting' | 'complete';
