const electron = require('electron');
const { contextBridge, ipcRenderer } = electron;

// Expose protected Node.js APIs
contextBridge.exposeInMainWorld('electron', {
  fileSystem: {
    readFile: (filepath) => ipcRenderer.invoke('fs:readFile', filepath),
    writeFile: (filepath, data) => ipcRenderer.invoke('fs:writeFile', filepath, data),
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