import React from 'react';
import {nanoid} from 'nanoid';

import LOGO from 'assets/logo.png';
import './index.scss';
import {RouteHref} from 'types/routes';

const ResultsDatasetLinks = () => {
  const elements = ['Helium', 'Nitrogen', 'Argon', 'Iron', 'Germanium'];
  return (
    <>
      {elements.map((ele) => (
        <li key={nanoid()}>
          <a href={RouteHref.RESULTS} className="red-text text-darken-4">
            {ele}
          </a>
        </li>
      ))}
    </>
  );
};

const Home = () => {
  return (
    <main id="pages-home">
      <div className="container">
        <div className="row">
          <div className="col s12 center-align logo">
            <img src={LOGO} alt="brand logo" />
          </div>
        </div>

        <div className="row card--main-search">
          <div className="col s6 offset-s3">
            <div className="">
              <span className="black-text">
                <form action="results-datasets" method="GET">
                  <input className="main-search-input" type="text" name="search" placeholder="Search Nuclear Data Streams" />
                  <button className="btn-floating red darken-4 z-depth-2">
                    <i className="fas fa-search"></i>
                  </button>
                </form>
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s6 offset-s3">
            <ul className="collection">
              <li>
                <h5 className="grey-text ">Latest Samples/Datasets</h5>
              </li>
              <ResultsDatasetLinks />
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col s6 offset-s3 center-align">
            <a className="waves-effect waves-light btn-large grey" href="data-ingestion">
              <i className="fas fa-upload"></i> Upload Data
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
