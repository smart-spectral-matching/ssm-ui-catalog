import {Container} from '@material-ui/core';
import Header from 'components/layout/Header';

const PageNotFound = () => (
  <main>
    <Header />
    <Container>
      <h1>This page does not exist.</h1>
    </Container>
  </main>
);

export default PageNotFound;
