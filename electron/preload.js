"use strict";

// electron/preload.ts
var electron = require("electron");
var { contextBridge, ipcRenderer } = electron;
contextBridge.exposeInMainWorld("electron", {
  fileSystem: {
    readFile: async (filepath) => {
      const data = await ipcRenderer.invoke("fs:readFile", filepath);
      return new Uint8Array(data);
    },
    writeFile: async (filepath, data) => {
      const arrayData = Array.from(new Uint8Array(data));
      return ipcRenderer.invoke("fs:writeFile", filepath, arrayData);
    }
  },
  dialog: {
    showOpenDialog: (options) => ipcRenderer.invoke("dialog:showOpen", options),
    showSaveDialog: (options) => ipcRenderer.invoke("dialog:showSave", options)
  },
  path: {
    join: (...args) => ipcRenderer.invoke("path:join", args),
    basename: (filepath) => ipcRenderer.invoke("path:basename", filepath)
  }
});
