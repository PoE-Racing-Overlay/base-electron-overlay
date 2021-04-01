import activeWindow from 'active-win';
import { basename } from 'path';

const APP_TITLES = ['Path of Exile'];
const APP_TITLE_STARTS_WITH = ['Path of Exile <---> '];
const APP_NAMES = [
  'pathofexile_x64_kg.exe',
  'pathofexile_kg.exe',
  'pathofexile_x64steam.exe',
  'pathofexilesteam.exe',
  'pathofexile_x64.exe',
  'pathofexile.exe',
  'pathofexile_x64_kg',
  'pathofexile_kg',
  'pathofexile_x64steam',
  'pathofexilesteam',
  'pathofexile_x64',
  'pathofexile',
  'wine64-preloader', // linux
];

class ActiveWindow {
  /**
   * @type {activeWindow.Result}
   */
  activeWindow;
  /**
   * @type {Boolean}
   */
  isActive;

  /**
   * @type {Object}
   */
  config;

  constructor(config = {}) {
    this.config = Object.assign(config, {});
  }

  /**
   * @returns {Boolean}
   */
  async applicationIsActive() {
    const current = await activeWindow();
    if (!current) {
      this.isActive = false;
      return;
    }
    if (current.id !== this.activeWindow.id) {
      const path = current.owner.path;
      const name = basename(path);
      const title = current.title;
      if (
        APP_NAMES.includes(name) &&
        APP_TITLES.includes(title) &&
        APP_TITLE_STARTS_WITH.some(value => title.startsWith(value))
      ) {
        this.isActive = true;
        this.activeWindow = current;
      }
    }
    return this.isActive;
  }
}
