// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import * as os from 'node:os';
import * as child_process from 'node:child_process';
import * as fs from 'node:fs';

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
    icon: path.join(process.env.VITE_PUBLIC || '', 'logo.png'),
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

  ipcMain.handle('get-cpu-usage', () => {
    return new Promise((resolve) => {
        const start = os.cpus();
        setTimeout(() => {
            const end = os.cpus();
            let totalIdle = 0;
            let totalTick = 0;

            for (let i = 0; i < start.length; i++) {
                const startCpu = start[i];
                const endCpu = end[i];
                const cpuTimes = endCpu.times;
                const startTimes = startCpu.times;

                totalTick += (cpuTimes.user - startTimes.user) + (cpuTimes.nice - startTimes.nice) + (cpuTimes.sys - startTimes.sys) + (cpuTimes.idle - startTimes.idle) + (cpuTimes.irq - startTimes.irq);
                totalIdle += cpuTimes.idle - startTimes.idle;
            }
            const usage = 100 - (totalIdle / totalTick) * 100;
            resolve(usage);
        }, 1000);
    });
  });

  ipcMain.handle('get-memory-usage', () => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    return {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usage: (usedMem / totalMem) * 100,
    };
  });

   ipcMain.handle('get-disk-info', async () => {
    return new Promise((resolve, reject) => {
      // This command works on macOS and Linux. For Windows, 'wmic logicaldisk' would be needed.
      const command = os.platform() === 'win32' ? 'wmic logicaldisk get size,freespace' : 'df -k /';
      child_process.exec(command, (err: child_process.ExecException | null, stdout: string) => {
        if (err) {
          return reject(err);
        }
        
        let total = 0;
        let free = 0;
        let used = 0;

        try {
          if (os.platform() === 'win32') {
             const lines = stdout.trim().split('\n').slice(1);
             lines.forEach((line: string) => {
                const parts = line.trim().split(/\s+/);
                if(parts.length >= 2){
                    free += parseInt(parts[0], 10);
                    total += parseInt(parts[1], 10);
                }
             });
             used = total - free;
          } else {
            const lines = stdout.trim().split('\n');
            const data = lines[lines.length - 1].split(/\s+/);
            total = parseInt(data[1], 10) * 1024;
            used = parseInt(data[2], 10) * 1024;
            free = parseInt(data[3], 10) * 1024;
          }
           resolve({ total, used, free, usage: (used / total) * 100 });
        } catch(e) {
            reject(e);
        }
      });
    });
  });

  ipcMain.handle('get-running-processes', () => {
      const command = os.platform() === 'win32' 
          ? 'tasklist /fo csv /nh'
          : 'ps -eo pid,ppid,pcpu,pmem,comm';

      return new Promise((resolve, reject) => {
          child_process.exec(command, (err: child_process.ExecException | null, stdout: string) => {
              if (err) return reject(err);

              const processes = stdout.trim().split('\n').map((line: string) => {
                  if (os.platform() === 'win32') {
                      const parts = line.replace(/"/g, '').split(',');
                      return {
                          pid: parseInt(parts[1], 10),
                          name: parts[0],
                          cpu: 0, // Tasklist doesn't provide easy CPU usage
                          mem: parseFloat(parts[4].replace(/,/g, '')) * 1024 // in KB to Bytes
                      };
                  } else {
                      const parts = line.trim().split(/\s+/);
                      return {
                          pid: parseInt(parts[0], 10),
                          name: parts[4],
                          cpu: parseFloat(parts[2]),
                          mem: parseFloat(parts[3])
                      };
                  }
              }).filter((p: any) => p.pid && p.name);
              resolve(processes.slice(0, 20)); // Limit for performance
          });
      });
  });


  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST || '', 'index.html'));
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
