import {observer, useLocalObservable} from 'mobx-react-lite';
import React from 'react';
import {nanoid} from 'nanoid';

import H20 from 'assets/h20.jpeg';
import Header from 'components/layout/Header';
import './index.scss';

enum FilterState {
  ALL = 'All',
  DATASETS = 'Datasets',
  SAMPLES = 'Samples',
}

const generateRandomCollections = (str: string) => {
  const ranDumb = Math.floor(Math.random() * 10) + 5; // from 5 to 15
  return Array.from(Array(ranDumb), (_, i) => `${str} ${i + 1}`);
};

const Collection = (props: {title: string; values: string[]; inputName?: string}) => {
  return (
    <ul className="collection">
      <li>
        <h6 className="grey-text text-darken-4">{props.title}</h6>
      </li>
      {props.values.map((value) => (
        <li key={nanoid()}>
          <label>
            <input name={props.inputName} type="checkbox" />
            <span>{value}</span>
          </label>
        </li>
      ))}
    </ul>
  );
};

const LoremIpsumCard = (props: {isSample?: boolean; filter: FilterState}) => {
  // this is a good example of a property which would normally be computed
  const isVisible =
    props.filter === FilterState.ALL ||
    (props.isSample && props.filter === FilterState.SAMPLES) ||
    (!props.isSample && props.filter === FilterState.DATASETS);
  if (!isVisible) return <></>;

  const example = props.isSample ? {url: 'detail-sample', display: 'Sample'} : {url: 'detail', display: 'Dataset'};

  return (
    <div className="card horizontal">
      <div className="card-image valign-wrapper">
        <img src={H20} alt="H20" />
      </div>
      <div className="card-stacked">
        <div className="card-content">
          <h5>
            <a href={example.url} className="red-text text-darken-4">
              H<sub>2</sub>O
            </a>
          </h5>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <div className={`chip right${!props.isSample ? ' red darken-4 white-text' : ''}`}>{example.display}</div>
        </div>
      </div>
    </div>
  );
};

const ResultsDatasets = () => {
  const state = useLocalObservable(() => ({
    filter: FilterState.ALL,
    /*
     * NOTE: Do not directly set JSX attributes derived from Math.random(), because ANY state change forces them to rerender
     */
    randomCards: Array.from(Array(Math.floor(Math.random() * 10) + 10), (_) => ({
      isSample: Math.random() >= 0.5,
    })),
    randomMethods: generateRandomCollections('Method'),
    randomSystems: generateRandomCollections('System'),
    randomAuthors: generateRandomCollections('Author'),
  }));

  return (
    <main id="pages-results-datasets">
      <Header />
      <div className="container">
        <div className="row">
          <div className="col s4">
            <form>
              <ul className="collection">
                <li>
                  <h6 className="grey-text text-darken-4">Filter By Type</h6>
                </li>
                <li>
                  {Object.values(FilterState).map((value) => (
                    <p key={nanoid()}>
                      <label>
                        <input
                          name="group1"
                          type="radio"
                          value={value}
                          checked={state.filter === value}
                          onChange={(e) => (state.filter = e.target.value as FilterState)}
                        />
                        <span>{value}</span>
                      </label>
                    </p>
                  ))}
                </li>
              </ul>
              <Collection title="Filter By Method" values={state.randomMethods} />
              <Collection title="Filter By System" values={state.randomSystems} />
              <Collection title="Filter By Author" values={state.randomAuthors} />
            </form>
          </div>
          <div className="col s8">
            {state.randomCards.map((v) => (
              <LoremIpsumCard key={nanoid()} isSample={v.isSample} filter={state.filter} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default observer(ResultsDatasets);
