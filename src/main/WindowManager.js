import { join } from 'path';
import { BrowserWindow } from 'electron';

/**
 * @type {Map<String,BrowserWindow>}
 */
const children = new Map();

class WindowManager {
  /**
   *
   * @param {String} key
   * @returns The BrowserWindow associated with the given key
   */
  getWindow(key) {
    return children.get(key);
  }

  /**
   *
   * @param {String} key The window key to set
   * @param {BrowserWindow} window the window to associate with the key
   */
  setWindow(key, window) {
    children.set(key, window);
  }

  /**
   * Create and store a new browser window with the given options
   * @param {String} key The window key to store the newly created window
   * @param {Electron.BrowserWindowConstructorOptions} options Any overrides to the BrowserWindow constructor options
   * @returns {BrowserWindow}
   */
  createWindow(key, options = {}) {
    const win = new BrowserWindow(
      Object.assign(options, {
        width: 800,
        height: 600,
        webPreferences: {
          // Use pluginOptions.nodeIntegration, leave this alone
          // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
          nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
          preload: join(__dirname, 'preload.js'),
        },
      }),
    );
    children.set(key, win);
    return win;
  }

  /**
   * Remove a window from the application
   * @param {String} key
   * @returns {void}
   */
  destroyWindow(key) {
    const child = children.get(key);
    if (child) {
      child.close();
      children.delete(key);
    }
  }
}
const winMgr = new WindowManager();
export default winMgr;
