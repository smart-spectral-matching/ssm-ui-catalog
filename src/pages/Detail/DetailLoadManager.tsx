import { FC, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Container, Skeleton } from '@mui/material';

import { API_URL } from 'ssm-constants';
import { useStore } from 'store/providers';
import { ApiProblem, BatsModel, RouteHref } from 'types';
import Detail from './Detail';

const HELPER_TEXT = `(example: ...${RouteHref.DETAIL}/datset-name-here/model-uuid-here)`;

enum LoadState {
  LOADING,
  LOADED,
  ERROR,
}

interface DetailsUrlProps {
  dataset?: string;
  model?: string;
}

const DetailLoadManager: FC<RouteComponentProps<DetailsUrlProps>> = (props) => {
  const { dataset, model } = props.match.params;

  const store = useStore();
  const state = useLocalObservable(() => ({
    loadState:
      store.cachedModel && store.cachedModel.uuid === model ? LoadState.LOADED : !!dataset && !!model ? LoadState.LOADING : LoadState.ERROR,
    errorMessage: !dataset
      ? `Dataset name not provided in URL ${HELPER_TEXT}`
      : !model
      ? `Model UUID not provided in URL ${HELPER_TEXT}`
      : '',
  }));

  useEffect(() => {
    if (state.loadState === LoadState.LOADING) {
      fetch(`${API_URL}/datasets/${dataset}/models/${model}`)
        .then((res) => {
          if (res.status >= 500)
            throw new Error(`Could not load model from API: Server messed up. Status ${res.status}: ${res.statusText}`);
          return res.json();
        })
        .then((json: BatsModel | ApiProblem) => {
          if ((json as ApiProblem).status && (json as ApiProblem).status >= 400) {
            throw new Error(`Could not load model from API: ${(json as ApiProblem).detail}`);
          }
          store.cachedModel = json as BatsModel;
          window.console.log(json);
          state.loadState = LoadState.LOADED;
        })
        .catch((err) => {
          state.errorMessage = err;
          state.loadState = LoadState.ERROR;
        });
    }
  }, [state.loadState]);

  return (
    <Container component="main">
      {state.loadState === LoadState.LOADED ? (
        <Detail data={store.cachedModel!} />
      ) : state.loadState === LoadState.ERROR ? (
        <div>
          <h5>The following error was found:</h5>
          <p>{state.errorMessage}</p>
        </div>
      ) : (
        <Skeleton variant="rectangular" height="100%" />
      )}
    </Container>
  );
};

export default observer(DetailLoadManager);
