import { FC, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { RouteComponentProps } from 'react-router-dom';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container, Skeleton } from '@mui/material';

import { API_URL } from 'ssm-constants';
import { useStore } from 'store/providers';
import { ApiProblem, BatsModel, LoadState, RouteHref } from 'types';
import Detail from './Detail';

const HELPER_TEXT = `(example: ...${RouteHref.DETAIL}/datset-name-here/model-uuid-here)`;

interface DetailsUrlProps {
  dataset?: string;
  model?: string;
}

const DetailLoadManager: FC<RouteComponentProps<DetailsUrlProps>> = (props) => {
  const { dataset, model } = props.match.params;

  const auth = useAuth();
  const authHeaders = new Headers();
  if (auth.user?.access_token) {
    authHeaders.append('Authorization', `Bearer ${auth.user!.access_token}`);
  }
  const fetchParams = { method: 'GET', headers: authHeaders };
  const store = useStore();
  const state = useLocalObservable(() => ({
    loadState:
      store.model.cachedModel && store.model.cachedModel.uuid === model
        ? LoadState.LOADED
        : !!dataset && !!model
        ? LoadState.LOADING
        : LoadState.ERROR,
    errorMessage: !dataset
      ? `Dataset name not provided in URL ${HELPER_TEXT}`
      : !model
      ? `Model UUID not provided in URL ${HELPER_TEXT}`
      : '',
  }));

  /**
   * Fetch model on initial mount, or when load state changes if it's changed to loading
   */
  useEffect(() => {
    if (state.loadState === LoadState.LOADING) {
      fetch(`${API_URL}/datasets/${dataset}/models/${model}`, fetchParams)
        .then((res) => {
          if (res.status >= 500)
            throw new Error(`Could not load model from API: Server messed up. Status ${res.status}: ${res.statusText}`);
          return res.json();
        })
        .then((json: BatsModel | ApiProblem) => {
          if ((json as ApiProblem).status && (json as ApiProblem).status >= 400) {
            throw new Error(`Could not load model from API: ${(json as ApiProblem).detail}`);
          }
          store.model.syncCacheAndUpdate(json as BatsModel);
          state.loadState = LoadState.LOADED;
        })
        .catch((err: Error) => {
          state.errorMessage = err.message;
          state.loadState = LoadState.ERROR;
        });
    }
  }, [state.loadState]);

  /**
   * retrigger load if cache is not in sync
   */
  useEffect(() => {
    if (!store.model.isCacheInSync) {
      state.loadState = LoadState.LOADING;
    }
  }, [store.model.isCacheInSync]);

  return (
    <Container component="main">
      {state.loadState === LoadState.LOADED ? (
        <Detail data={store.model.cachedModel!} />
      ) : state.loadState === LoadState.ERROR ? (
        <>
          <h3>The following error was found:</h3>
          <p>{state.errorMessage}</p>
        </>
      ) : (
        <Skeleton variant="rectangular" animation="wave" height="70vh" />
      )}
    </Container>
  );
};

export default observer(DetailLoadManager);
