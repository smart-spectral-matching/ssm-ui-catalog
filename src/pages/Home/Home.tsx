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
} from '@material-ui/core';
import {CloudUpload} from '@material-ui/icons';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {useEffect} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';

import LOGO from 'assets/logo.png';
import SearchBar from 'components/SearchBar';
import {useStore} from 'store/providers';
import {BatsModelCondensed, PaginatedResponse, RouteHref} from 'types';
import CustomTablePaginationActions from 'components/CustomTablePaginationActions';

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

const Home = observer(() => {
  const store = useStore();
  const state = useLocalObservable(() => ({
    elements: [] as Array<BatsModelCondensed>,
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
    parseResponse: (response: PaginatedResponse<BatsModelCondensed>) => {
      state.elements = response.data;
      state.count = response.total;
    },
    changePage: (newPage: number) => {
      state.page = newPage; // triggers useEffect hook
    },
  }));
  const history = useHistory();

  /**
   * this is local because we should refetch every time the Home page is re-rendered,
   * to get the latest models
   */
  useEffect(() => {
    if (store.datasetUuid) {
      fetch(
        `${process.env.REACT_APP_API_URL}/datasets/${store.datasetUuid}/models?pageNumber=${state.oneBasedPage}&pageSize=${PAGE_SIZE}&returnFull=false`
      )
        .then((res) => res.json())
        .then((json: PaginatedResponse<BatsModelCondensed>) => {
          state.parseResponse(json);
          window.console.log(state.elements);
        })
        // TODO we can add a state variable to update the UI later on
        .catch((err) => window.console.error("Didn't fetch model summaries", err));
    }
  }, [store.datasetUuid, state.page]);

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
                {state.elements.map((ele, idx) => (
                  <TableRow key={ele.uuid}>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={`${idx % 2 === 0 ? RouteHref.DETAIL_SAMPLE : RouteHref.DETAIL_DATASET}/${store.datasetUuid}/${ele.uuid}`}
                      >
                        {ele.title}
                      </Link>
                    </TableCell>
                    <TableCell>{ele.modified}</TableCell>
                    <TableCell>{ele.created}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPage={PAGE_SIZE}
                    rowsPerPageOptions={[]}
                    count={state.count}
                    page={state.page}
                    onChangePage={(e, page) => state.changePage(page)}
                    colSpan={3}
                    ActionsComponent={CustomTablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
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
