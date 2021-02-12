import {useMemo, Suspense} from 'react';
import {configure} from 'mobx';
import {useMediaQuery, Backdrop, CssBaseline, CircularProgress, ThemeProvider} from '@material-ui/core';

import './App.scss';
import Routes from 'Routes';
import ErrorBoundary from 'components/shared/ErrorBoundary';
import {RootStoreProvider} from 'store/providers';
import makeTheme from './theme';

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  //disableErrorBoundaries: true,
});
const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => makeTheme(prefersDarkMode ? 'dark' : 'light'), [prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
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
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
