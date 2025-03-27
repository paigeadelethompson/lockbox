import { Kdbx, KdbxError, ProtectedValue, KdbxUuid, KdbxEntry, Consts, Credentials, KdbxBinary } from 'kdbxweb';
import { Entry } from '../types/Entry';
import { DatabaseOptions, databaseService } from './databaseService';

interface CustomField {
  key: string;
  value: string;
  isProtected: boolean;
}

interface Attachment {
  name: string;
  data: ArrayBuffer;
  mimeType: string;
}

class KdbxService {
  private kdbx: Kdbx | null = null;
  private static instance: KdbxService;
  private currentDatabasePath: string | null = null;

  private constructor() {}

  static getInstance(): KdbxService {
    if (!KdbxService.instance) {
      KdbxService.instance = new KdbxService();
    }
    return KdbxService.instance;
  }

  async createNewDatabase(options: DatabaseOptions): Promise<void> {
    try {
      // Create credentials using the database service
      const credentials = await databaseService.createCredentials(options);

      // Create new database with basic settings
      this.kdbx = await Kdbx.create(credentials, options.name);
      
      // Set KDF to AES (KDBX3)
      this.kdbx.setKdf(Consts.KdfId.Aes);

      // Set the database path
      this.currentDatabasePath = options.name;
      
      // Add to database history
      await databaseService.addToHistory({
        id: crypto.randomUUID(),
        name: options.name,
        path: options.name,
        lastOpened: Date.now(),
        keyFile: options.keyFile,
        hardwareKey: options.hardwareKey
      });
    } catch (error) {
      console.error('Failed to create database:', error);
      throw error;
    }
  }

  async saveDatabase(filePath?: string): Promise<void> {
    if (!this.kdbx) {
      throw new Error('No database loaded');
    }

    try {
      const data = await this.kdbx.save();
      
      // Save to file system in Electron
      if (window.electron) {
        const { fileSystem } = window.electron;
        
        // Use provided file path or throw an error
        if (!filePath) {
          throw new Error('No save location selected');
        }
        
        console.log('Saving database to:', filePath);
        // Convert ArrayBuffer to Uint8Array for writing
        const uint8Array = new Uint8Array(data);
        await fileSystem.writeFile(filePath, uint8Array);
        console.log('Database saved successfully to:', filePath);
      }
    } catch (error) {
      console.error('Failed to save database:', error);
      throw error;
    }
  }

  async loadDatabase(filePath: string, password: string, keyFile?: string, hardwareKey?: string): Promise<void> {
    try {
      let data: ArrayBuffer;
      
      if (window.electron) {
        const { fileSystem } = window.electron;
        // Ensure we have a valid file path
        if (!filePath) {
          throw new Error('No file path provided');
        }
        // If the path doesn't end with .kdbx, append it
        const fullPath = filePath.endsWith('.kdbx') ? filePath : `${filePath}.kdbx`;
        console.log('Loading database from:', fullPath);
        const fileData = await fileSystem.readFile(fullPath);
        console.log('Received file data length:', fileData.length);
        // Use the Uint8Array directly since it's already converted in the preload script
        data = fileData.buffer;
        console.log('Using ArrayBuffer, length:', data.byteLength);
      } else {
        const storedData = localStorage.getItem("passwordDatabase");
        if (!storedData) {
          throw new Error("No database found in localStorage");
        }
        data = new Uint8Array(JSON.parse(storedData)).buffer;
      }

      // Create credentials
      const credentials = await databaseService.createCredentials({
        password,
        keyFile,
        hardwareKey
      });

      // Load the database
      console.log('Attempting to load database with credentials');
      this.kdbx = await Kdbx.load(data, credentials);
      this.currentDatabasePath = filePath;
      
      // Update last opened time
      await databaseService.updateLastOpened(filePath);
    } catch (error) {
      console.error('Failed to load database:', error);
      throw error;
    }
  }

  async addEntry(entry: Entry): Promise<void> {
    if (!this.kdbx) {
      throw new Error('No database loaded');
    }

    try {
      const defaultGroup = this.kdbx.getDefaultGroup();
      const kdbxEntry = this.kdbx.createEntry(defaultGroup);
      
      // Set the entry fields
      kdbxEntry.fields.set('Title', ProtectedValue.fromString(entry.title));
      kdbxEntry.fields.set('UserName', ProtectedValue.fromString(entry.username));
      kdbxEntry.fields.set('Password', ProtectedValue.fromString(entry.password));
      if (entry.url) kdbxEntry.fields.set('URL', ProtectedValue.fromString(entry.url));
      if (entry.notes) kdbxEntry.fields.set('Notes', ProtectedValue.fromString(entry.notes));

      // Store the entry ID in a custom field
      kdbxEntry.fields.set('EntryId', ProtectedValue.fromString(entry.id));

      // Add custom fields if they exist
      if (entry.customFields) {
        for (const field of entry.customFields) {
          const value = field.isProtected 
            ? ProtectedValue.fromString(field.value)
            : field.value;
          kdbxEntry.fields.set(field.key, value);
        }
      }

      // Add attachments if they exist
      if (entry.attachments) {
        for (const attachment of entry.attachments) {
          const binary = ProtectedValue.fromBinary(attachment.data);
          kdbxEntry.binaries.set(attachment.name, binary);
        }
      }

      await this.saveDatabase();
    } catch (error) {
      console.error('Failed to add entry:', error);
      throw error;
    }
  }

  async getEntries(): Promise<Entry[]> {
    if (!this.kdbx) {
      throw new Error('No database loaded');
    }

    try {
      const defaultGroup = this.kdbx.getDefaultGroup();
      return defaultGroup.entries.map(entry => {
        const titleField = entry.fields.get('Title');
        const usernameField = entry.fields.get('UserName');
        const passwordField = entry.fields.get('Password');
        const urlField = entry.fields.get('URL');
        const notesField = entry.fields.get('Notes');
        const idField = entry.fields.get('EntryId');

        // Get custom fields
        const customFields: CustomField[] = [];
        entry.fields.forEach((value, key) => {
          if (key !== 'Title' && key !== 'UserName' && key !== 'Password' && 
              key !== 'URL' && key !== 'Notes' && key !== 'EntryId') {
            customFields.push({
              key,
              value: value instanceof ProtectedValue ? value.getText() : value,
              isProtected: value instanceof ProtectedValue
            });
          }
        });

        // Get attachments
        const attachments: Attachment[] = [];
        entry.binaries.forEach((binary, name) => {
          const data = binary instanceof ProtectedValue 
            ? binary.getBinary() 
            : binary instanceof ArrayBuffer 
              ? binary 
              : new Uint8Array(0).buffer;
          attachments.push({
            name,
            data,
            mimeType: 'application/octet-stream'
          });
        });

        return {
          id: idField instanceof ProtectedValue ? idField.getText() : entry.uuid.id,
          title: titleField instanceof ProtectedValue ? titleField.getText() : '',
          username: usernameField instanceof ProtectedValue ? usernameField.getText() : '',
          password: passwordField instanceof ProtectedValue ? passwordField.getText() : '',
          url: urlField instanceof ProtectedValue ? urlField.getText() : '',
          notes: notesField instanceof ProtectedValue ? notesField.getText() : '',
          createdAt: entry.times.creationTime?.getTime() || Date.now(),
          customFields,
          attachments
        };
      });
    } catch (error) {
      console.error('Failed to get entries:', error);
      throw error;
    }
  }

  async deleteEntry(entryId: string): Promise<void> {
    if (!this.kdbx) {
      throw new Error('No database loaded');
    }

    try {
      const defaultGroup = this.kdbx.getDefaultGroup();
      const entry = defaultGroup.entries.find(e => {
        const idField = e.fields.get('EntryId');
        return idField instanceof ProtectedValue ? idField.getText() === entryId : e.uuid.id === entryId;
      });
      if (entry) {
        this.kdbx.remove(entry);
        await this.saveDatabase();
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
      throw error;
    }
  }

  async updateEntry(entry: Entry): Promise<void> {
    if (!this.kdbx) {
      throw new Error('No database loaded');
    }

    try {
      const defaultGroup = this.kdbx.getDefaultGroup();
      const kdbxEntry = defaultGroup.entries.find(e => {
        const idField = e.fields.get('EntryId');
        return idField instanceof ProtectedValue ? idField.getText() === entry.id : e.uuid.id === entry.id;
      });
      if (kdbxEntry) {
        kdbxEntry.fields.set('Title', ProtectedValue.fromString(entry.title));
        kdbxEntry.fields.set('UserName', ProtectedValue.fromString(entry.username));
        kdbxEntry.fields.set('Password', ProtectedValue.fromString(entry.password));
        if (entry.url) kdbxEntry.fields.set('URL', ProtectedValue.fromString(entry.url));
        if (entry.notes) kdbxEntry.fields.set('Notes', ProtectedValue.fromString(entry.notes));

        // Update custom fields
        if (entry.customFields) {
          // Remove old custom fields
          kdbxEntry.fields.forEach((_, key) => {
            if (key !== 'Title' && key !== 'UserName' && key !== 'Password' && 
                key !== 'URL' && key !== 'Notes' && key !== 'EntryId') {
              kdbxEntry.fields.delete(key);
            }
          });

          // Add new custom fields
          for (const field of entry.customFields) {
            const value = field.isProtected 
              ? ProtectedValue.fromString(field.value)
              : field.value;
            kdbxEntry.fields.set(field.key, value);
          }
        }

        // Update attachments
        if (entry.attachments) {
          // Remove old attachments
          kdbxEntry.binaries.clear();

          // Add new attachments
          for (const attachment of entry.attachments) {
            const binary = ProtectedValue.fromBinary(attachment.data);
            kdbxEntry.binaries.set(attachment.name, binary);
          }
        }

        await this.saveDatabase();
      }
    } catch (error) {
      console.error('Failed to update entry:', error);
      throw error;
    }
  }

  getCurrentDatabasePath(): string | null {
    return this.currentDatabasePath;
  }
}

export const kdbxService = KdbxService.getInstance(); 