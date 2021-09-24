import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { CloudUpload, Refresh } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Link,
  MenuItem,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

import CustomTablePaginationActions from 'components/CustomTablePaginationActions';
import { API_URL } from 'ssm-constants';
import { useStore } from 'store/providers';
import { BatsModelCondensed, PaginatedResponse, RouteHref } from 'types';

const PAGE_SIZE = 5;

const Row = styled('section')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(1.5),
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
    if (store.dataset.datasetsLoaded) return;
    fetch(`${API_URL}/datasets`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((json: Array<string>) => store.dataset.updateDatasets(json))
      .catch((err) => {
        store.dataset.datasetLoadErr = 'Did not fetch datasets, click reload button to try again';
        window.console.error(err);
      })
      .finally(() => (store.dataset.datasetsLoaded = true));
  }, [store.dataset.datasetsLoaded]);

  /**
   * this is local because we should refetch every time the Home page is re-rendered,
   * to get the latest models
   */
  useEffect(() => {
    if (!store.dataset.selectedDataset) return;
    fetch(
      `${API_URL}/datasets/${store.dataset.selectedDataset}/models?pageNumber=${state.oneBasedPage}&pageSize=${PAGE_SIZE}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((json: PaginatedResponse<BatsModelCondensed>) => state.showModels(json))
      .catch((err) => {
        state.modelErr = 'Could not fetch models';
        window.console.error(err);
      });
  }, [store.dataset.selectedDataset, state.oneBasedPage]);

  return (
    <Container component="main" sx={{ mt: 8 }}>
      <Row>
        <Box display="flex" sx={{ minWidth: '50%' }}>
          <TextField
            id="select-dataset"
            value={store.dataset.selectedDataset}
            label="Select Dataset"
            variant="standard"
            error={!!store.dataset.datasetLoadErr}
            helperText={store.dataset.datasetLoadErr}
            select
            SelectProps={{ onChange: (e) => (store.dataset.selectedDataset = e.target.value as string) }}
          >
            {store.dataset.datasets.map((dataset) => (
              <MenuItem value={dataset} key={dataset}>
                {dataset}
              </MenuItem>
            ))}
          </TextField>
          <IconButton
            color="secondary"
            aria-label="refresh datasets"
            title="Refresh Datasets"
            onClick={() => (store.dataset.datasetsLoaded = false)}
          >
            <Refresh />
          </IconButton>
        </Box>
      </Row>
      <Row>
        <Paper sx={{ minWidth: '50%' }}>
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
                {state.modelErr || store.dataset.datasetLoadErr ? (
                  <TableRow>
                    <TableCell colSpan={3}>{state.modelErr || store.dataset.datasetLoadErr}</TableCell>
                  </TableRow>
                ) : state.models.length ? (
                  state.models.map((ele) => (
                    <TableRow key={ele.uuid}>
                      <TableCell>
                        <Link
                          component={RouterLink}
                          to={`${RouteHref.DETAIL}/${store.dataset.selectedDataset}/${ele.uuid}`}
                          onClick={() => store.model.setSecondaryCache(ele.uuid, ele.modified)}
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
      </Row>

      <Row>
        <Button variant="contained" color="primary" startIcon={<CloudUpload />} size="large" title="Upload is currently non-functional.">
          Upload Data
        </Button>
      </Row>
    </Container>
  );
};

export default observer(Home);
