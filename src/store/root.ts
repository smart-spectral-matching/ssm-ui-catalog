import {makeAutoObservable} from 'mobx';

/**
 * TODO this will eventually be spread out into a more tree-like structure,
 * this is just convenient for now
 */
export class RootStore {
  constructor() {
    makeAutoObservable(this);
  }
}
