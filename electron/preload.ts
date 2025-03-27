const electron = require('electron');
const { contextBridge, ipcRenderer } = electron;

// Expose protected Node.js APIs
contextBridge.exposeInMainWorld('electron', {
  fileSystem: {
    readFile: async (filepath) => {
      const data = await ipcRenderer.invoke('fs:readFile', filepath);
      // The data is already an array from the main process
      return new Uint8Array(data);
    },
    writeFile: async (filepath, data) => {
      // Convert Uint8Array to array for IPC
      const arrayData = Array.from(new Uint8Array(data));
      return ipcRenderer.invoke('fs:writeFile', filepath, arrayData);
    },
  },
  dialog: {
    showOpenDialog: (options) => ipcRenderer.invoke('dialog:showOpen', options),
    showSaveDialog: (options) => ipcRenderer.invoke('dialog:showSave', options),
  },
  path: {
    join: (...args) => ipcRenderer.invoke('path:join', args),
    basename: (filepath) => ipcRenderer.invoke('path:basename', filepath),
  },
}); 