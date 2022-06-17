import { makeAutoObservable } from 'mobx';

import makeTheme from 'theme';
import { DatasetStore } from './dataset';
import { ModelStore } from './model';

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

    let savedTheme: string | null | boolean = localStorage.getItem('dark-theme');
    if (typeof savedTheme === 'string') {
      savedTheme = savedTheme === 'true';
    }

    this.darkTheme = savedTheme == null ? window.matchMedia('(prefers-color-scheme: dark)').matches : savedTheme;
    makeAutoObservable(this);
  }

  toggleTheme() {
    this.darkTheme = !this.darkTheme;
    localStorage.setItem('dark-theme', `${this.darkTheme}`);
  }

  get muiTheme() {
    return makeTheme(this.darkTheme ? 'dark' : 'light');
  }
}
