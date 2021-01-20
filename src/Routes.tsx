import React from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';

import Detail from 'components/Detail';
import Home from 'components/Home';
import Footer from 'components/layout/Footer';
import ResultsDatasets from 'components/ResultsDatasets';
import ErrorBoundary from 'components/shared/ErrorBoundary';
import ErrorBoundaryRoute from 'components/shared/ErrorBoundaryRoute';
import PageNotFound from 'components/shared/PageNotFound';
import {RouteHref} from 'types/routes';

const Routes = () => {
  return (
    <Router>
      {/* TODO: manage Header here instead of inside each component? */}
      <ErrorBoundary>
        <Switch>
          <ErrorBoundaryRoute path={RouteHref.HOME} exact component={Home} />
          <ErrorBoundaryRoute path={RouteHref.DETAIL_DATASET} component={Detail} />
          <ErrorBoundaryRoute path={RouteHref.DETAIL_SAMPLE} component={() => <Detail isSample />} />
          <ErrorBoundaryRoute path={RouteHref.RESULTS} component={ResultsDatasets} />
          <ErrorBoundaryRoute component={PageNotFound} />
        </Switch>
      </ErrorBoundary>
      <Footer />
    </Router>
  );
};

export default Routes;
