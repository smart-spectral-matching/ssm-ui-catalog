import { makeAutoObservable } from 'mobx';

import { BatsModel } from 'types';
import { RootStore } from './root';

export class ModelStore {
  rootStore: RootStore;

  /**
   * keep latest model data stored in store cache
   *
   * Do NOT directly modify this property - call syncCacheAndUpdate(model) instead
   */
  cachedModel: BatsModel | undefined = undefined;

  /**
   * Do NOT directly modify this property - call setSecondaryCache(uuid, model) instead
   */
  secondaryCacheKey = '';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  /**
   * Make sure that both model cache and secondary cache are in sync
   *
   * If model is not defined yet, just return true - no need to resync
   */
  get isCacheInSync() {
    if (!this.cachedModel) return true;
    return this.secondaryCacheKey === `${this.cachedModel.uuid}_${this.cachedModel.modified}`;
  }

  /**
   * @param model new model
   *
   * Updates model and resyncs cache
   */
  syncCacheAndUpdate(model: BatsModel) {
    this.cachedModel = model;
    this.setSecondaryCache(this.cachedModel.uuid, this.cachedModel.modified);
  }

  /**
   * Update the secondary cache. This MAY cause a divergence from the primary cache.
   *
   * @param uuid uuid property from paginated model
   * @param modified modified property from paginated model
   */
  setSecondaryCache(uuid: string, modified: string) {
    this.secondaryCacheKey = `${uuid}_${modified}`;
  }
}
