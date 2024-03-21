import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  saveApps: (apps: string) => ipcRenderer.send('saveApps', apps),
  windowAction: (type: string) => ipcRenderer.send('window-action', type),
  ping: () => ipcRenderer.invoke('ping'),
  load: () => ipcRenderer.invoke('load'),
  forcePing: (callback) => ipcRenderer.on('forcePing', (_event, value) => callback(value))
})
