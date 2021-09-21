import './App.scss';

import { Suspense, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { configure } from 'mobx';
import { Backdrop, CircularProgress, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';

import ErrorBoundary from 'components/shared/ErrorBoundary';
import { API_URL } from 'ssm-constants';
import { RootStoreProvider } from 'store/providers';
import makeTheme from 'theme';
import Routes from './Routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const d = await fetch(`${API_URL}${queryKey[0]}`);
        if (!d.ok) throw new Error(d.statusText);
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
