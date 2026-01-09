// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import os from 'node:os';
import child_process from 'node:child_process';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── electron
// │ │    └── main.js
// │ │    └── preload.js
// │ │
// │ └─┬ dist-next
// │   └── ...
//
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.DIST, '../public')
  : process.env.DIST;

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    frame: false,
    titleBarStyle: 'hidden',
    icon: path.join(process.env.VITE_PUBLIC, 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString());
  });

  // Native API handlers
  ipcMain.on('minimize-window', () => win?.minimize());
  ipcMain.on('maximize-window', () => {
    if (win?.isMaximized()) {
      win.unmaximize();
    } else {
      win?.maximize();
    }
  });
  ipcMain.on('close-window', () => win?.close());

  // System Info Handler
  ipcMain.handle('get-system-info', () => {
    return {
        os: `${os.type()} ${os.release()}`,
        cpu: os.cpus()[0].model,
        ram: `${(os.totalmem() / 1024 ** 3).toFixed(2)} GB`,
        // Using a simple command to get graphics card info. This is platform-dependent.
        gpu: getGpuInfo(),
        hostname: os.hostname(),
        userInfo: os.userInfo(),
    };
  });


  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

function getGpuInfo() {
    try {
        if (os.platform() === 'win32') {
            const result = child_process.execSync('wmic path win32_videocontroller get name').toString();
            return result.split('\n')[1].trim();
        }
        if (os.platform() === 'darwin') {
            const result = child_process.execSync('system_profiler SPDisplaysDataType | grep "Chipset Model"').toString();
            return result.split(':')[1].trim();
        }
        if (os.platform() === 'linux') {
            const result = child_process.execSync('lspci | grep VGA').toString();
            return result.split(':')[2].trim().split('(')[0].trim();
        }
    } catch (e) {
        console.error("Could not get GPU info", e);
        return "Not Available";
    }
    return "Not Available";
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
