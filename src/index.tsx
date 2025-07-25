import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import reportWebVitals from 'reportWebVitals';
import * as serviceWorkerRegistration from 'serviceWorkerRegistration';
import { RootStoreProvider } from 'store/providers';
import App from './App';

ReactDOM.render(
  <StrictMode>
    <RootStoreProvider>
      <App />
    </RootStoreProvider>
  </StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(process.env.NODE_ENV !== 'production' ? window.console.debug : undefined);
