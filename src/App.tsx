import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';

import './App.css';
import Routes from 'Routes';
import ErrorBoundary from 'components/shared/ErrorBoundary';
import {RootStoreProvider} from 'store/providers';

const App = () => {
  useEffect(() => {
    M.Collapsible.init(document.querySelectorAll('.collapsible'));
  }, []);

  return (
    <ErrorBoundary>
      <RootStoreProvider>
        <Routes />
      </RootStoreProvider>
    </ErrorBoundary>
  );
};

export default observer(App);
