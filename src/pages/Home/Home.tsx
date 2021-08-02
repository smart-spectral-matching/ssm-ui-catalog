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
import {Link as RouterLink} from 'react-router-dom';

import CustomTablePaginationActions from 'components/CustomTablePaginationActions';
import {BatsModelCondensed, PaginatedResponse, RouteHref} from 'types';
import {API_URL, DATASET} from 'ssm-constants';

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

  /**
   * this is local because we should refetch every time the Home page is re-rendered,
   * to get the latest models
   */
  useEffect(() => {
    fetch(`${API_URL}/datasets/${DATASET}/models?pageNumber=${state.oneBasedPage}&pageSize=${PAGE_SIZE}&returnFull=false`)
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((json: PaginatedResponse<BatsModelCondensed>) => {
        state.parseResponse(json);
      })
      // TODO we can add a state variable to update the UI later on
      .catch((err) => window.console.error("Didn't fetch model summaries", err));
  }, [state.page]);

  const classes = useStyles();

  return (
    <Container component="main" className={classes.root}>
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
                        to={`${idx % 2 === 0 ? RouteHref.DETAIL_SAMPLE : RouteHref.DETAIL_DATASET}/${DATASET}/${ele.uuid}`}
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
                    onPageChange={(e, page) => state.changePage(page)}
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
};

export default observer(Home);
