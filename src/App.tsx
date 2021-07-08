import {useMemo, Suspense} from 'react';
import {configure} from 'mobx';
import {useMediaQuery, Backdrop, CssBaseline, CircularProgress, ThemeProvider} from '@material-ui/core';

import './App.scss';
import Routes from 'Routes';
import ErrorBoundary from 'components/shared/ErrorBoundary';
import {RootStoreProvider} from 'store/providers';
import makeTheme from './theme';
import {QueryClient, QueryClientProvider} from 'react-query';

import {API_URL} from 'ssm-constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({queryKey}) => {
        const d = await fetch(`${API_URL}${queryKey[0]}`);
        return d.json();
      },
    },
  },
});

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  // disableErrorBoundaries: true,
});
const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => makeTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <RootStoreProvider>
            <Suspense
              fallback={
                <Backdrop open>
                  <CircularProgress />
                </Backdrop>
              }
            >
              <Routes />
            </Suspense>
          </RootStoreProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
