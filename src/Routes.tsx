import { lazy } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import ErrorBoundary from 'components/shared/ErrorBoundary';
import ErrorBoundaryRoute from 'components/shared/ErrorBoundaryRoute';
import { RouteHref } from 'types';

const About = lazy(() => import('pages/About'));
const Detail = lazy(() => import('pages/Detail'));
const Home = lazy(() => import('pages/Home'));
const SearchResults = lazy(() => import('pages/SearchResults'));
const PageNotFound = lazy(() => import('components/shared/PageNotFound'));

const Routes = () => (
  <Router>
    <Header />
    <ErrorBoundary>
      <Switch>
        <ErrorBoundaryRoute path={`${RouteHref.DETAIL}/:dataset?/:model?`} component={Detail} />
        <ErrorBoundaryRoute path={`${RouteHref.SEARCH}/:searchTerm?`} component={SearchResults} />
        <ErrorBoundaryRoute path={RouteHref.ABOUT} component={About} />
        <ErrorBoundaryRoute exact path={RouteHref.HOME} component={Home} />
        <ErrorBoundaryRoute component={PageNotFound} />
      </Switch>
    </ErrorBoundary>
    <Footer />
  </Router>
);

export default Routes;
