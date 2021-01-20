import React, {ErrorInfo} from 'react';

interface IErrorBoundaryProps {
  readonly children: JSX.Element | JSX.Element[];
}

interface IErrorBoundaryState {
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Reusable Component wrapper which displays the error message in the UI if an inner component throws an error. (Only verbose in production environment.)
 * From the component which threw the error, the nearest parent component which implements `componentDidCatch` will render the error.
 *
 * Mostly used for easier debugging, but can potentially allow for the application to recover if a rerender can be triggered.
 *
 * NOTE: Since 'ComponentDidCatch' is not implemented in React FunctionalComponents, and since we are using a paired-down version of MobX which only uses FunctionComponents, there may be some issues when dealing with Observers.
 */
class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = {error: undefined, errorInfo: undefined};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    const {error, errorInfo} = this.state;
    if (error || errorInfo) {
      return (
        <aside>
          <h2>An unexpected error has occurred.</h2>
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>{error ? error.toString() : 'Error w/out message:'}</summary>
              <p>{errorInfo ? errorInfo.componentStack : 'No additional error info provided'}</p>
            </details>
          )}
        </aside>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
