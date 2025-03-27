import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';

// Register IPC handlers
function registerIpcHandlers() {
  // Handle dialog IPC calls
  ipcMain.handle('dialog:showOpen', async (_, options) => {
    return dialog.showOpenDialog(options);
  });

  ipcMain.handle('dialog:showSave', async (_, options) => {
    return dialog.showSaveDialog(options);
  });

  // Handle file system operations
  ipcMain.handle('fs:readFile', async (_, filepath) => {
    try {
      // Convert relative path to absolute path
      const absolutePath = path.isAbsolute(filepath) ? filepath : path.join(process.cwd(), filepath);
      console.log('Reading file from:', absolutePath);
      
      // Check if file exists
      const exists = await fs.access(absolutePath).then(() => true).catch(() => false);
      if (!exists) {
        throw new Error(`File does not exist: ${absolutePath}`);
      }
      
      // Get file stats
      const stats = await fs.stat(absolutePath);
      console.log('File size:', stats.size);
      
      // Read the file
      const data = await fs.readFile(absolutePath);
      console.log('Read data length:', data.length);
      console.log('First few bytes:', data.slice(0, 4));
      
      // Convert Buffer to Array for IPC
      const arrayData = Array.from(new Uint8Array(data));
      console.log('Converted array length:', arrayData.length);
      console.log('First few array elements:', arrayData.slice(0, 4));
      return arrayData;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  });

  ipcMain.handle('fs:writeFile', async (_, filepath, data) => {
    try {
      // Convert relative path to absolute path
      const absolutePath = path.isAbsolute(filepath) ? filepath : path.join(process.cwd(), filepath);
      // Ensure directory exists
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });
      // Write the data directly as it's already a Uint8Array
      await fs.writeFile(absolutePath, data);
      return true;
    } catch (error) {
      throw error;
    }
  });

  // Handle path operations
  ipcMain.handle('path:join', (_, args) => {
    return path.join(...args);
  });

  ipcMain.handle('path:basename', (_, filepath) => {
    return path.basename(filepath);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the Vite dev server URL in development
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile('dist/index.html');
  }
}

// Register handlers and create window when app is ready
app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 