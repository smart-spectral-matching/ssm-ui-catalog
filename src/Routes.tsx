import React from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';

import Detail from 'components/Detail';
import Home from 'components/Home';
import Footer from 'components/layout/Footer';
import ResultsDatasets from 'components/ResultsDatasets';
import ErrorBoundary from 'components/shared/ErrorBoundary';
import ErrorBoundaryRoute from 'components/shared/ErrorBoundaryRoute';
import PageNotFound from 'components/shared/PageNotFound';

const Routes = () => {
  return (
    <Router>
      {/* TODO: manage Header here instead of inside each component? */}
      <ErrorBoundary>
        <Switch>
          <ErrorBoundaryRoute path="/" exact component={Home} />
          <ErrorBoundaryRoute path="/detail" component={Detail} />
          <ErrorBoundaryRoute path="/detail-sample" component={() => <Detail isSample />} />
          <ErrorBoundaryRoute path="/results-datasets" component={ResultsDatasets} />
          <ErrorBoundaryRoute component={PageNotFound} />
        </Switch>
      </ErrorBoundary>
      <Footer />
    </Router>
  );
};

export default Routes;
