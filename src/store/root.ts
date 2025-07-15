import { makeAutoObservable } from 'mobx';

import makeTheme from 'theme';
import { DatasetStore } from './dataset';
import { ModelStore } from './model';

const THEME_STORAGE_KEY = 'dark-theme';

export class RootStore {
  dataset: DatasetStore;

  model: ModelStore;

  /**
   * true if user wants to use dark theme
   */
  darkTheme: boolean;

  constructor() {
    this.dataset = new DatasetStore(this);
    this.model = new ModelStore(this);

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (typeof savedTheme === 'string') {
      // value already exists in local storage
      this.darkTheme = savedTheme === 'true';
    } else {
      // get theme from user browser. Don't save to local storage unless user changes theme directly
      this.darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    makeAutoObservable(this);
  }

  toggleTheme() {
    this.darkTheme = !this.darkTheme;
    localStorage.setItem(THEME_STORAGE_KEY, `${this.darkTheme}`);
  }

  get muiTheme() {
    return makeTheme(this.darkTheme ? 'dark' : 'light');
  }
}
