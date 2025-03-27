import { PlatformPath } from 'path';

interface ElectronAPI {
  fileSystem: {
    readFile: (filepath: string) => Promise<number[]>;
    writeFile: (filepath: string, data: number[]) => Promise<boolean>;
  };
  dialog: {
    showOpenDialog: (options: { 
      title?: string; 
      filters?: { name: string; extensions: string[] }[];
    }) => Promise<{ filePaths: string[] }>;
    showSaveDialog: (options: { 
      title?: string; 
      defaultPath?: string; 
      filters?: { name: string; extensions: string[] }[];
    }) => Promise<{ filePath: string | undefined }>;
  };
  path: {
    join: (...args: string[]) => string;
    basename: (filepath: string) => string;
  };
  process: {
    cwd: () => Promise<string>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

interface Window {
  confirm: (message: string) => boolean;
  alert: (message: string) => void;
  electron?: ElectronAPI;
}

interface Navigator {
  clipboard: {
    writeText(text: string): Promise<void>;
  };
} 