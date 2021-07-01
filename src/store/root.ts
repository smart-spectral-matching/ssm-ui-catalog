import {makeAutoObservable} from 'mobx';

/**
 * TODO this will eventually be spread out into a more tree-like structure,
 * this is just convenient for now
 */
export class RootStore {
  /**
   * For now, define this variable on application startup,
   * then persist it forever.
   */
  datasetUuid: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setDatasetUuid(datasetUuid: string) {
    this.datasetUuid = datasetUuid;
  }
}
