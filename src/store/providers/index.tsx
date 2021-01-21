import {observer} from 'mobx-react-lite';
import React, {createContext, PropsWithChildren, useContext} from 'react';
import {RootStore} from 'store/root';

export const store = new RootStore();

const StoreContext = createContext<null | RootStore>(store);

export function useStore(): RootStore {
  const store = useContext(StoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
}

export const RootStoreProvider = observer((props: PropsWithChildren<{}>) => {
  return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
});