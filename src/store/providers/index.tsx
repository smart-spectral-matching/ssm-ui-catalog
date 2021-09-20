import { createContext, FC, useContext } from 'react';

import { RootStore } from 'store/root';

export const store = new RootStore();

const StoreContext = createContext<null | RootStore>(store);

export function useStore(): RootStore {
  const rootStore = useContext(StoreContext);
  if (rootStore === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return rootStore;
}

export const RootStoreProvider: FC = (props) => <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
