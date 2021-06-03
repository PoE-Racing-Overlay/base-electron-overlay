import activeWindow from 'active-win';
import { basename } from 'path';

/**
 * A global reference to the currently active window
 * @type {activeWindow.Result}
 */
const activeWindow;

export default class ActiveWindow {
  constructor(config = {}) {
    /**
     * @type {Object}
     */
    this.config = Object.assign(config, {});
    /**
     * @type {activeWindow.Result}
     */
    this._activeWindow = undefined;
    /**
     * @type {boolean}
     */
    this.isActive = false;
  }

  /**
   * @returns {Boolean}
   */
  async applicationIsActive() {
    const old = this._activeWindow;
    const current = this.activeWindow;
    if (!current) {
      this.isActive = false;
      return this.isActive;
    }
    if (old && current.id !== old.id) {
      const path = current.owner.path;
      const name = basename(path);
      const title = current.title;
      if (
        this.config.names.includes(name) &&
        this.config.titles.includes(title) &&
        this.config.titleStartsWith.some(value => title.startsWith(value))
      ) {
        this.isActive = true;
      }
    }
    return this.isActive;
  }

  /**
   * Get the currently active window
   * @returns {activeWindow.Result}
   */
  async get activeWindow() {
    this._activeWindow = await activeWindow();
    return this._activeWindow;
  }

  /**
   * Get the path to the application owning the current window
   * @returns {string}
   */
  async get applicationPath() {
    this.activeWindow.owner.path;
  }
}
