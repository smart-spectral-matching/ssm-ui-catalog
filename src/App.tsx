import './App.scss';

import { Suspense } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { configure } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Backdrop, CircularProgress, CssBaseline, ThemeProvider } from '@mui/material';

import ErrorBoundary from 'components/shared/ErrorBoundary';
import { API_URL, OIDC_AUTH_URL, OIDC_CLIENT_ID, OIDC_REDIRECT_URL } from 'ssm-constants';
import { RootStoreProvider, useStore } from 'store/providers';
import Routes from './Routes';

const oidcConfig = {
  authority: OIDC_AUTH_URL,
  client_id: OIDC_CLIENT_ID,
  redirect_uri: OIDC_REDIRECT_URL,
  autoSignIn: false,
};
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
  enforceActions: 'never',
  // enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  // observableRequiresReaction: true,
  // disableErrorBoundaries: true,
});
const App = observer(() => {
  const store = useStore();

  return (
    <AuthProvider {...oidcConfig}>
      <ThemeProvider theme={store.muiTheme}>
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
    </AuthProvider>
  );
});

export default App;
