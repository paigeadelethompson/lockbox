import { PlatformPath } from 'path';

interface ElectronAPI {
  fileSystem: {
    readFile: (filepath: string) => Promise<Buffer>;
    writeFile: (filepath: string, data: Buffer | string) => Promise<boolean>;
  };
  dialog: {
    showOpenDialog: (options: { title?: string; filters?: { name: string; extensions: string[] }[] }) => Promise<{ filePaths: string[] }>;
    showSaveDialog: (options: { title?: string; defaultPath?: string; filters?: { name: string; extensions: string[] }[] }) => Promise<{ filePath: string | undefined }>;
  };
  path: {
    join: (...args: string[]) => string;
    basename: (filepath: string) => string;
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
  electron?: {
    fs: typeof import('fs');
    path: typeof import('path');
  };
}

interface Navigator {
  clipboard: {
    writeText(text: string): Promise<void>;
  };
} 