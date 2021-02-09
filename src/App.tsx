import {Suspense} from 'react';
import {configure} from 'mobx';
import {Backdrop, CssBaseline, CircularProgress, ThemeProvider} from '@material-ui/core';

import './App.scss';
import Routes from 'Routes';
import ErrorBoundary from 'components/shared/ErrorBoundary';
import {RootStoreProvider} from 'store/providers';
import theme from './theme';

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  //disableErrorBoundaries: true
});
const App = () => {
  window.console.log(theme);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <RootStoreProvider>
          <Suspense
            fallback={
              <Backdrop open disableStrictModeCompat>
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
