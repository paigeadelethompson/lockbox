import { PlatformPath } from 'path';

interface ElectronAPI {
  fs: typeof import("fs");
  path: PlatformPath;
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
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
} 