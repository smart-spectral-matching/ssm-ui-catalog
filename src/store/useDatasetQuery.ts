import {useEffect} from 'react';
import {useQuery, UseQueryResult} from 'react-query';

import {useStore} from './providers';

/**
 * TODO
 *
 * This method fetches the most recent query, then stores the first dataset UUID in the store.
 *
 * The idea is to only make this call once per user visit - the obvious problem is that
 * if more than one dataset exists, this may not be the correct dataset we want.
 *
 * We will probably want to make a separate landing page which allows a user to personally
 * select a dataset to add to the store, instead of just assuming there will always be one dataset.
 */
export const useDatasetQuery = () => {
  const store = useStore();
  const query: UseQueryResult<Array<string>, any> = useQuery(`/datasets/uuids`);

  useEffect(() => {
    if (query.isFetched) {
      store.setDatasetUuid(query.data![0]);
      window.console.log(store.datasetUuid);
    }
  }, [query.isFetched]);
};
