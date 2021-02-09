import {Component} from 'react';
import {Route, RouteProps} from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

const ErrorBoundaryRoute = ({...rest}: RouteProps) => {
  const encloseInErrorBoundary = (props: any) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );

  return <Route {...rest} render={encloseInErrorBoundary} />;
};

export default ErrorBoundaryRoute;
