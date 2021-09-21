import { makeAutoObservable } from 'mobx';

import { BatsModel } from 'types';

/**
 * TODO this will eventually be spread out into a more tree-like structure,
 * this is just convenient for now
 */
export class RootStore {
  datasetsLoaded = false;

  datasetLoadErr = '';

  datasets: Array<string> = [];

  selectedDataset = '';

  /**
   * keep latest model data stored in store cache
   */
  cachedModel: BatsModel | undefined = undefined;

  constructor() {
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
