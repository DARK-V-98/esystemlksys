// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.send('minimize-window'),
  maximize: () => ipcRenderer.send('maximize-window'),
  close: () => ipcRenderer.send('close-window'),

  // System Info
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getCpuUsage: () => ipcRenderer.invoke('get-cpu-usage'),
  getMemoryUsage: () => ipcRenderer.invoke('get-memory-usage'),
  getDiskInfo: () => ipcRenderer.invoke('get-disk-info'),
  getRunningProcesses: () => ipcRenderer.invoke('get-running-processes'),
});
