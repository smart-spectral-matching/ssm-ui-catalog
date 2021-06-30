import {Route, RouteProps} from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

export const ErrorBoundaryRoute = ({component: Component, ...rest}: RouteProps) => {
  if (!Component) throw new Error(`A component needs to be specified for path ${(rest as Omit<RouteProps, 'component'>).path}`);

  return (
    <Route
      {...rest}
      render={(props) => (
        <ErrorBoundary>
          <Component {...props} />
        </ErrorBoundary>
      )}
    />
  );
};

export default ErrorBoundaryRoute;
