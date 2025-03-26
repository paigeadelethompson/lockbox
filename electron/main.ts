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
      const data = await fs.readFile(filepath);
      return data;
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('fs:writeFile', async (_, filepath, data) => {
    try {
      await fs.writeFile(filepath, data);
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