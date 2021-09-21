import { DatasetStore } from './dataset';
import { ModelStore } from './model';

export class RootStore {
  dataset: DatasetStore;

  model: ModelStore;

  constructor() {
    this.dataset = new DatasetStore(this);
    this.model = new ModelStore(this);
  }
}
