import {BrowserRouter as Router, Switch} from 'react-router-dom';
import {lazy} from 'react';

import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import ErrorBoundary from 'components/shared/ErrorBoundary';
import ErrorBoundaryRoute from 'components/shared/ErrorBoundaryRoute';
import {RouteHref} from 'types';

const About = lazy(() => import('pages/About'));
const Detail = lazy(() => import('pages/Detail/Detail'));
const DetailSample = lazy(() => import('pages/Detail/DetailSample'));
const Home = lazy(() => import('pages/Home'));
const SearchResults = lazy(() => import('pages/SearchResults'));
const PageNotFound = lazy(() => import('components/shared/PageNotFound'));

const Routes = () => {
  return (
    <Router>
      <Header />
      <ErrorBoundary>
        <Switch>
          <ErrorBoundaryRoute path={`${RouteHref.DETAIL_DATASET}/:dataset?/:model?`} component={Detail} />
          <ErrorBoundaryRoute path={`${RouteHref.DETAIL_SAMPLE}/:dataset?/:model?`} component={DetailSample} />
          <ErrorBoundaryRoute path={`${RouteHref.SEARCH}/:searchTerm?`} component={SearchResults} />
          <ErrorBoundaryRoute path={RouteHref.ABOUT} component={About} />
          <ErrorBoundaryRoute exact path={RouteHref.HOME} component={Home} />
          <ErrorBoundaryRoute component={PageNotFound} />
        </Switch>
      </ErrorBoundary>
      <Footer />
    </Router>
  );
};

export default Routes;
