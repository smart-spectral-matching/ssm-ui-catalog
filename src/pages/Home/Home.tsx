import {nanoid} from 'nanoid';
import {makeStyles, Button, Container, Link, Typography} from '@material-ui/core';
import {CloudUpload} from '@material-ui/icons';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {FC, useEffect} from 'react';

import LOGO from 'assets/logo.png';
import {RouteHref} from 'types/routes';
import SearchBar from 'components/SearchBar';
import {useStore} from 'store/providers';
import {BatsModelCondensed} from 'types/batsModel';
import {PaginatedResponse} from 'types/paginated-response';

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
  elements: Array<BatsModelCondensed>;
}

const ModelSummaries: FC<ModelSummariesProps> = observer(({elements}) => {
  return (
    <>
      {elements.map((ele) => (
        <li key={nanoid()}>
          <Link href={RouteHref.RESULTS}>{ele.title}</Link>
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
        <SearchBar className={classes.rowContent} onSearch={(result) => undefined} />
      </div>

      <div className={classes.row}>
        <ul className={classes.rowContent}>
          <li>
            <Typography variant="h5" color="textSecondary">
              Latest Samples/Datasets
            </Typography>
          </li>
          <ModelSummaries elements={state.elements} />
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
