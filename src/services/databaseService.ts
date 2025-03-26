import { KdbxCredentials, ProtectedValue, KdbxUuid, Consts } from 'kdbxweb';

export interface DatabaseHistory {
  id: string;
  name: string;
  path: string;
  lastOpened: number;
  keyFile?: string;
  hardwareKey?: boolean;
}

export interface DatabaseOptions {
  name: string;
  password: string;
  path?: string;
  keyFile?: string;
  hardwareKey?: boolean;
  algorithm?: 'AES' | 'ChaCha20';
  keyDerivation?: 'PBKDF2';
  iterations?: number;
  memory?: number;
  parallelism?: number;
}

class DatabaseService {
  private static readonly HISTORY_KEY = 'databaseHistory';
  private static instance: DatabaseService;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async getDatabaseHistory(): Promise<DatabaseHistory[]> {
    const history = localStorage.getItem(DatabaseService.HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  }

  async addToHistory(database: DatabaseHistory): Promise<void> {
    const history = await this.getDatabaseHistory();
    const existingIndex = history.findIndex(h => h.path === database.path);
    
    if (existingIndex >= 0) {
      history[existingIndex] = { ...database, lastOpened: Date.now() };
    } else {
      history.push({ ...database, lastOpened: Date.now() });
    }

    // Keep only the last 10 databases
    history.sort((a, b) => b.lastOpened - a.lastOpened);
    const trimmedHistory = history.slice(0, 10);

    localStorage.setItem(DatabaseService.HISTORY_KEY, JSON.stringify(trimmedHistory));
  }

  async removeFromHistory(path: string): Promise<void> {
    const history = await this.getDatabaseHistory();
    const filteredHistory = history.filter(h => h.path !== path);
    localStorage.setItem(DatabaseService.HISTORY_KEY, JSON.stringify(filteredHistory));
  }

  async createCredentials(options: DatabaseOptions): Promise<KdbxCredentials> {
    // Convert password to UTF-8 bytes
    const passwordBytes = new TextEncoder().encode(options.password);
    
    // Create protected value with the bytes
    const protectedValue = ProtectedValue.fromBinary(passwordBytes);

    const credentials = new KdbxCredentials(protectedValue);

    if (options.keyFile) {
      const keyFileData = await this.readKeyFile(options.keyFile);
      credentials.setKeyFile(keyFileData);
    }

    if (options.hardwareKey) {
      // Note: Hardware key support would need to be implemented
      // This is a placeholder for future implementation
      throw new Error('Hardware key support not implemented yet');
    }

    return credentials;
  }

  private async readKeyFile(path: string): Promise<ArrayBuffer> {
    // This would need to be implemented based on the platform
    // For web, we'd need to use the File API
    throw new Error('Key file reading not implemented yet');
  }

  async getDatabaseOptions(path: string): Promise<DatabaseOptions | null> {
    const history = await this.getDatabaseHistory();
    const database = history.find(h => h.path === path);
    if (!database) return null;

    return {
      name: database.name,
      password: '', // We don't store passwords
      path: database.path,
      keyFile: database.keyFile,
      hardwareKey: database.hardwareKey,
    };
  }
}

export const databaseService = DatabaseService.getInstance(); 