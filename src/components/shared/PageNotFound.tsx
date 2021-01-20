import React from 'react';

import Header from 'components/layout/Header';

const PageNotFound = () => {
  return (
    <main>
      <Header />
      <div className="container">
        <h1>This page does not exist.</h1>
      </div>
    </main>
  );
};

export default PageNotFound;
