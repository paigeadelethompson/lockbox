const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Set Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' http://localhost:3000;",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000;",
          "style-src 'self' 'unsafe-inline' http://localhost:3000;",
          "img-src 'self' data: https:;",
          "connect-src 'self' http://localhost:3000;",
          "font-src 'self' data:;",
          "object-src 'none';",
          "base-uri 'self';",
          "form-action 'self';",
          "frame-ancestors 'none';"
        ].join(' ')
      }
    });
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
    
    // Enable hot reload
    mainWindow.webContents.on('did-fail-load', () => {
      console.log('Failed to load app, retrying...');
      setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000');
      }, 1000);
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);

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

// Add IPC handlers for dialog operations
ipcMain.handle('dialog:showOpen', async (event, options) => {
  return dialog.showOpenDialog({
    ...options,
    properties: ['openFile', ...(options.properties || [])]
  });
});

ipcMain.handle('dialog:showSave', async (event, options) => {
  return dialog.showSaveDialog(options);
});

// Add IPC handler for getting current working directory
ipcMain.handle('process:cwd', () => {
  return process.cwd();
});

// Add IPC handlers for file system operations
ipcMain.handle('fs:readFile', async (event, filepath) => {
  try {
    const data = await fs.readFile(filepath);
    return data.toString();
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
});

ipcMain.handle('fs:writeFile', async (event, filepath, data) => {
  try {
    await fs.writeFile(filepath, data);
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
});

// Add IPC handlers for path operations
ipcMain.handle('path:join', async (event, args) => {
  return path.join(...args);
});

ipcMain.handle('path:basename', async (event, filepath) => {
  return path.basename(filepath);
}); 