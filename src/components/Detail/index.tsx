import React from 'react';

import Header from 'components/layout/Header';
import './index.scss';

const Detail = (props: {isSample?: boolean}) => {
  return (
    <main id="pages-detail">
      <Header />
      <div className="container">
        <div className="row">
          <div className="col s12">
            <h3>
              H<sub>2</sub>O {props.isSample && 'Sample'}
            </h3>
          </div>
          <div className="col s6">
            <p>
              Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
              vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.
              Mauris placerat eleifend leo.
            </p>
            <ul className="collection">
              <li>
                <span className="gray-text text-darken-4" title="Lorum ipsum dolor sit amet">
                  Lorem
                </span>
              </li>
              <li>
                <span className="grey-text text-darken-4" title="Aliquam tincidunt mauris eu risus">
                  Aliquam
                </span>
              </li>
              <li>
                <span className="grey-text text-darken-4" title="Morbi in sem quis dui placerat ornare">
                  Morbi
                </span>
              </li>
              <li>
                <span className="grey-text text-darken-4" title="Praesent dapibus, neque id cursus faucibus">
                  Praesent
                </span>
              </li>
              <li>
                <span className="grey-text text-darken-4" title="Pellentesque fermentum dolor">
                  Pellentesque
                </span>
              </li>
            </ul>
          </div>
          <div className="col s6">
            <div className="card">
              <div className="card-image">
                <video autoPlay loop>
                  <source
                    src="https://ak6.picdn.net/shutterstock/videos/1012853036/preview/stock-footage-animation-rotation-of-model-molecule-from-glass-and-crystal.webm"
                    type="video/mp4"
                  />
                  <source
                    src="https://ak6.picdn.net/shutterstock/videos/1012853036/preview/stock-footage-animation-rotation-of-model-molecule-from-glass-and-crystal.webm"
                    type="video/ogg"
                  />
                  Your browser does not support the video tag.
                </video>
                <span className="card-title">Demo Visualization</span>
              </div>
              <div className="card-content">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <ul className="collapsible">
            {!props.isSample && (
              <li>
                <div className="collapsible-header">
                  <i className="fas fa-flask"></i> Method
                </div>
                <div className="collapsible-body">
                  <ul className="collection">
                    <li>
                      <b>Evaluation: </b> calculation
                    </li>
                  </ul>

                  <ul className="collapsible popout">
                    <li>
                      <div className="collapsible-header"> calculation/1/</div>
                      <div className="collapsible-body">
                        <ul className="collection">
                          <li>
                            <b>Approach: </b> Quantum Mechanics
                          </li>
                          <li>
                            <b>Calc Class: </b> ab initio
                          </li>
                          <li>
                            <b>Calc Type: </b> ab ccsd(t)
                          </li>
                          <li>
                            <b>Sub Method: </b> calculation/2/
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li>
                      <div className="collapsible-header"> calculation/2/</div>
                      <div className="collapsible-body">
                        <ul className="collection">
                          <li>
                            <b>Approach: </b> Quantum Mechanics
                          </li>
                          <li>
                            <b>Calc Class: </b> ab initio
                          </li>
                          <li>
                            <b>Calc Type: </b> ab ccsd(t)
                          </li>
                          <li>
                            <b>Sub Method: </b> calculation/2/
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>

                  <ul className="collapsible popout">
                    <li>
                      <div className="collapsible-header"> basisset/1/</div>
                      <div className="collapsible-body">
                        <ul className="collection">
                          <li>
                            <b>Title: </b> 3-21G
                          </li>
                          <li>
                            <b>Description: </b> A test BSE basis set
                          </li>
                          <li>
                            <b>Format: </b> orbital
                          </li>
                          <li>
                            <b>Set Type: </b> Quantum Mechanics
                          </li>
                          <li>
                            <b>Harmonic Type: </b> Spherical
                          </li>
                          <li>
                            <b>Contraction Type: </b> general
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
            )}
            <li>
              <div className="collapsible-header">
                <i className="fas fa-atom"></i> System
              </div>
              <div className="collapsible-body">
                <ul className="collection">
                  <li>
                    <b>Discipline: </b> chemistry
                  </li>
                  <li>
                    <b>Subdiscipline: </b> computational chemistry
                  </li>
                  <li>
                    <b>Facets: </b>
                    <ul className="collection">
                      <li>temperature</li>
                      <li>charge</li>
                      <li>multiplicity</li>
                      <li>space</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div className="collapsible-header">
                <i className="fas fa-users"></i> Authors
              </div>
              <div className="collapsible-body">
                <ul className="collection">
                  <li>John Doe</li>
                  <li>Jane Doe</li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Detail;
