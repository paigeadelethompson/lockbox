"use strict";

// electron/preload.ts
var { contextBridge, ipcRenderer } = require("electron");
var path = require("path");
contextBridge.exposeInMainWorld("electron", {
  fileSystem: {
    readFile: (filepath) => ipcRenderer.invoke("fs:readFile", filepath),
    writeFile: (filepath, data) => ipcRenderer.invoke("fs:writeFile", filepath, data)
  },
  dialog: {
    showOpenDialog: (options) => ipcRenderer.invoke("dialog:showOpen", options),
    showSaveDialog: (options) => ipcRenderer.invoke("dialog:showSave", options)
  },
  path: {
    join: (...args) => path.join(...args),
    basename: (filepath) => path.basename(filepath)
  }
});
