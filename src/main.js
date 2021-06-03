'use strict';
import dotenv from 'dotenv';
import { BrowserWindow, app, protocol, screen } from 'electron';
import installExtension from 'electron-devtools-installer';
import path from 'path';
import './main/ipc';
import winMgr from './main/WindowManager';
import ActiveWindow from './main/ActiveWindow';
import * as targetApplication from './main/config/target-application';
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });
const isDevelopment = process.env.NODE_ENV !== 'production';
const scheme = process.env.SCHEME_NAME || 'overlay';
let activeWindow;

// Ensure we only ever have once instance of the application running
if (!app.requestSingleInstanceLock()) {
  app.exit();
}

function createWindow() {
  const { bounds } = screen.getPrimaryDisplay();

  const win = winMgr.createWindow('main', {
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    transparent: false,
    frame: false,
    resizable: false,
    movable: false,
    focusable: false,
    skipTaskbar: true,
    show: false,
  });

  win.removeMenu();
  win.setIgnoreMouseEvents(true);

  if (process.platform !== 'linux') {
    win.setAlwaysOnTop(true, 'pop-up-menu', 1);
  } else {
    win.setAlwaysOnTop(true);
  }

  win.setVisibleOnAllWorkspaces(true);

  win.once('show', () => {
    // could use this to handle updates
  });

  win.on('closed', () => {
    winMgr.destroyWindow('main');
  });

  // start listening for when our target application is active
  activeWindow = new ActiveWindow(targetApplication);
  return win;
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: scheme, privileges: { secure: true, standard: true } }]);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      const completion = await installExtension('ljjemllljcmogpfapbkkighbhhppjdbg');
      console.log('Vue Devtools should be available with message: ', completion);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

app.setAsDefaultProtocolClient(scheme);
