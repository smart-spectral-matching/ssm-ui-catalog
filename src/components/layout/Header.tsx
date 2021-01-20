import React from 'react';

import LOGO from 'assets/logo.png';
import './Header.scss';
import {RouteHref} from 'types/routes';

const Header = () => {
  return (
    <nav id="components-header" className="grey lighten-4">
      <div className="nav-wrapper">
        <div className="row">
          <div className="col s1">
            <a href={RouteHref.HOME} className="brand-logo">
              <img src={LOGO} alt="Brand logo" />
            </a>
          </div>
          <div className="col s6 offset-s1">
            <form action="results-datasets" method="GET">
              <input className="main-search-input" type="text" name="search" placeholder="Search Nuclear Data Streams"></input>
              <button className="btn-floating red darken-4 z-depth-2">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
