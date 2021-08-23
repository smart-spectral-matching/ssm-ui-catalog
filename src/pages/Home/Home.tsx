import {
  makeStyles,
  Button,
  Container,
  Link,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableFooter,
  TableCell,
  TablePagination,
  Toolbar,
  MenuItem,
  IconButton,
  TextField,
  CircularProgress,
  Box,
} from '@material-ui/core';
import {CloudUpload, Refresh} from '@material-ui/icons';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {useEffect} from 'react';
import {Link as RouterLink} from 'react-router-dom';

import CustomTablePaginationActions from 'components/CustomTablePaginationActions';
import {BatsModelCondensed, PaginatedResponse, RouteHref} from 'types';
import {API_URL} from 'ssm-constants';
import {useStore} from 'store/providers';

const PAGE_SIZE = 5;

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

const Home = () => {
  const store = useStore();
  const state = useLocalObservable(() => ({
    modelErr: '',
    modelsLoaded: false,
    models: [] as Array<BatsModelCondensed>,
    /**
     * This is ZERO BASED because the Material-UI pagination component
     * assumes this.
     */
    page: 0,
    count: 0,
    /**
     * We want to use this when interacting with the API + for human-readable content
     */
    get oneBasedPage() {
      return state.page + 1;
    },
    showModels: (response: PaginatedResponse<BatsModelCondensed>) => {
      state.modelErr = '';
      state.modelsLoaded = true;
      state.models = response.data;
      state.count = response.total;
    },
    changePage: (newPage: number) => {
      state.page = newPage; // triggers useEffect hook
    },
  }));

  /**
   * update on initial Home page mount, and when reload button clicked.
   * do not automatically run this if a user navigates to Home a second time
   */
  useEffect(() => {
    if (store.datasetsLoaded) return;
    fetch(`${API_URL}/datasets`)
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((json: Array<string>) => store.updateDatasets(json))
      .catch((err) => {
        store.datasetLoadErr = 'Did not fetch datasets, click reload button to try again';
        window.console.error(err);
      })
      .finally(() => (store.datasetsLoaded = true));
  }, [store.datasetsLoaded]);

  /**
   * this is local because we should refetch every time the Home page is re-rendered,
   * to get the latest models
   */
  useEffect(() => {
    if (!store.selectedDataset) return;
    fetch(`${API_URL}/datasets/${store.selectedDataset}/models?pageNumber=${state.oneBasedPage}&pageSize=${PAGE_SIZE}&returnFull=false`)
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((json: PaginatedResponse<BatsModelCondensed>) => state.showModels(json))
      .catch((err) => {
        state.modelErr = 'Could not fetch models';
        window.console.error(err);
      });
  }, [store.selectedDataset, state.oneBasedPage]);

  const classes = useStyles();

  return (
    <Container component="main" className={classes.root}>
      <section className={classes.row}>
        <Box display="flex" className={classes.rowContent}>
          <TextField
            id="select-dataset"
            value={store.selectedDataset}
            label="Select Dataset"
            error={!!store.datasetLoadErr}
            helperText={store.datasetLoadErr}
            select
            SelectProps={{onChange: (e) => (store.selectedDataset = e.target.value as string)}}
          >
            {store.datasets.map((dataset) => (
              <MenuItem value={dataset} key={dataset}>
                {dataset}
              </MenuItem>
            ))}
          </TextField>
          <IconButton
            color="secondary"
            aria-label="refresh datasets"
            title="Refresh Datasets"
            onClick={() => (store.datasetsLoaded = false)}
          >
            <Refresh />
          </IconButton>
        </Box>
      </section>
      <section className={classes.row}>
        <Paper className={classes.rowContent}>
          <Toolbar>
            <Typography variant="h5" color="textSecondary">
              Latest Models
            </Typography>
          </Toolbar>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Last Modified Date</TableCell>
                  <TableCell>Created On Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.modelErr || store.datasetLoadErr ? (
                  <TableRow>
                    <TableCell colSpan={3}>{state.modelErr || store.datasetLoadErr}</TableCell>
                  </TableRow>
                ) : state.models.length ? (
                  state.models.map((ele, idx) => (
                    <TableRow key={ele.uuid}>
                      <TableCell>
                        <Link
                          component={RouterLink}
                          to={`${idx % 2 === 0 ? RouteHref.DETAIL_SAMPLE : RouteHref.DETAIL_DATASET}/${store.selectedDataset}/${ele.uuid}`}
                        >
                          {ele.title}
                        </Link>
                      </TableCell>
                      <TableCell>{ele.modified}</TableCell>
                      <TableCell>{ele.created}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPage={PAGE_SIZE}
                    rowsPerPageOptions={[]}
                    count={state.count}
                    page={state.page}
                    onPageChange={(e, page) => state.changePage(page)}
                    colSpan={3}
                    ActionsComponent={CustomTablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </section>

      <section className={classes.row}>
        <Button variant="contained" color="primary" startIcon={<CloudUpload />} size="large" title="Upload is currently non-functional.">
          Upload Data
        </Button>
      </section>
    </Container>
  );
};

export default observer(Home);
