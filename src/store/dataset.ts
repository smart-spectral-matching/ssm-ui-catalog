import { makeAutoObservable } from 'mobx';

import { RootStore } from './root';

export class DatasetStore {
  rootStore: RootStore;

  datasetsLoaded = false;

  datasetLoadErr = '';

  datasets: Array<string> = [];

  selectedDataset = '';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  updateDatasets(newDatasets: Array<string>) {
    this.datasets = newDatasets;
    if (newDatasets.length) {
      this.datasetLoadErr = '';
      /*
       * If there isn't a selected dataset (OR if the new datasets do not have the old dataset), and there are new datasets,
       * set the selected dataset to be the first in the list.
       */
      if (!this.selectedDataset || !newDatasets.includes(this.selectedDataset)) {
        this.selectedDataset = this.datasets[0];
      }
    } else {
      this.selectedDataset = '';
      this.datasetLoadErr = 'No datasets currently exist.';
    }
  }
}
