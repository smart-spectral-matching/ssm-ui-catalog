import {nanoid} from 'nanoid';
import {makeStyles, Button, Container, Link, Typography} from '@material-ui/core';
import {CloudUpload} from '@material-ui/icons';

import LOGO from 'assets/logo.png';
import {RouteHref} from 'types/routes';
import SearchBar from 'components/SearchBar';

const elements = ['Helium', 'Nitrogen', 'Argon', 'Iron', 'Germanium'];

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

const ResultsDatasetLinks = () => {
  return (
    <>
      {elements.map((ele) => (
        <li key={nanoid()}>
          <Link href={RouteHref.RESULTS}>{ele}</Link>
        </li>
      ))}
    </>
  );
};

const Home = () => {
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
          <ResultsDatasetLinks />
        </ul>
      </div>

      <div className={classes.row}>
        <Button variant="contained" color="primary" startIcon={<CloudUpload />} size="large" title="Upload is currently non-functional.">
          Upload Data
        </Button>
      </div>
    </Container>
  );
};

export default Home;
