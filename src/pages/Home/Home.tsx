import {nanoid} from 'nanoid';
import {makeStyles, Button, Container, Link, Typography} from '@material-ui/core';
import {CloudUpload} from '@material-ui/icons';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {FC, useEffect} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';

import LOGO from 'assets/logo.png';
import SearchBar from 'components/SearchBar';
import {useStore} from 'store/providers';
import {BatsModelCondensed, PaginatedResponse, RouteHref} from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(1.5),
  },
  rowContent: {
    minWidth: '50%',
  },
}));

interface ModelSummariesProps {
  dataset?: string;
  elements: Array<BatsModelCondensed>;
}

const ModelSummaries: FC<ModelSummariesProps> = observer(({dataset, elements}) => {
  if (!dataset) return null;
  return (
    <>
      {elements.map((ele, idx) => (
        <li key={nanoid()}>
          <Link component={RouterLink} to={`${idx % 2 === 0 ? RouteHref.DETAIL_SAMPLE : RouteHref.DETAIL_DATASET}/${dataset}/${ele.uuid}`}>
            {ele.title}
          </Link>
        </li>
      ))}
    </>
  );
});

const Home = observer(() => {
  const store = useStore();
  const state = useLocalObservable(() => ({
    elements: [] as Array<BatsModelCondensed>,
    setElements: (elements: Array<BatsModelCondensed>) => {
      state.elements = elements;
    },
  }));
  const history = useHistory();

  /**
   * this is local because we should refetch every time the Home page is re-rendered,
   * to get the latest models
   */
  useEffect(() => {
    if (store.datasetUuid) {
      fetch(`${process.env.REACT_APP_API_URL}/datasets/${store.datasetUuid}/models?returnFull=false`)
        .then((res) => res.json())
        .then((json: PaginatedResponse<BatsModelCondensed>) => {
          state.setElements(json.data);
          window.console.log(state.elements);
        })
        // TODO we can add a state variable to update the UI later on
        .catch((err) => window.console.error("Didn't fetch model summaries", err));
    }
  }, [store.datasetUuid]);

  const classes = useStyles();

  return (
    <Container component="main" className={classes.root}>
      <div className={classes.row}>
        <img src={LOGO} alt="brand logo" width="150" height="100" />
      </div>

      <div className={classes.row}>
        <SearchBar className={classes.rowContent} onSearch={(result) => history.push(RouteHref.SEARCH)} />
      </div>

      <div className={classes.row}>
        <ul className={classes.rowContent}>
          <li>
            <Typography variant="h5" color="textSecondary">
              Latest Samples/Datasets
            </Typography>
          </li>
          <ModelSummaries dataset={store.datasetUuid} elements={state.elements} />
        </ul>
      </div>

      <div className={classes.row}>
        <Button variant="contained" color="primary" startIcon={<CloudUpload />} size="large" title="Upload is currently non-functional.">
          Upload Data
        </Button>
      </div>
    </Container>
  );
});

export default Home;
