import {BrowserRouter as Router, Switch} from 'react-router-dom';
import {lazy} from 'react';

import Footer from 'components/layout/Footer';
import ErrorBoundary from 'components/shared/ErrorBoundary';
import ErrorBoundaryRoute from 'components/shared/ErrorBoundaryRoute';
import {RouteHref} from 'types/routes';

const Detail = lazy(() => import('pages/Detail'));
const Home = lazy(() => import('pages/Home'));
const ResultsDatasets = lazy(() => import('pages/ResultsDatasets'));
const PageNotFound = lazy(() => import('components/shared/PageNotFound'));

const Routes = () => {
  return (
    <Router>
      {/* TODO: manage Header here instead of inside each component? */}
      <ErrorBoundary>
        <Switch>
          <ErrorBoundaryRoute path={RouteHref.DETAIL_DATASET} component={Detail} />
          <ErrorBoundaryRoute path={RouteHref.DETAIL_SAMPLE} component={() => <Detail isSample />} />
          <ErrorBoundaryRoute path={RouteHref.RESULTS} component={ResultsDatasets} />
          <ErrorBoundaryRoute exact path={RouteHref.HOME} component={Home} />
          <ErrorBoundaryRoute component={PageNotFound} />
        </Switch>
      </ErrorBoundary>
      <Footer />
    </Router>
  );
};

export default Routes;
