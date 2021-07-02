import {makeStyles, AppBar, Link, Toolbar} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';

import LOGO from 'assets/logo.png';
import {RouteHref} from 'types';
import SearchBar from 'components/SearchBar';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(1, 0, 1, 0),
  },
  toolbar: {
    justifyContent: 'space-around',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.between('xs', 'sm')]: {
      justifyContent: 'space-between',
    },
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    maxWidth: '15%',
  },
  searchBarContainer: {
    flex: 1,
    maxWidth: '75%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  return (
    <AppBar color="secondary" position="static" component="header" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.imageContainer}>
          <Link className={classes.logo} component={RouterLink} to={RouteHref.HOME}>
            <img src={LOGO} alt="Smart Spectral Matching - Home" width="100" height="67" />
          </Link>
        </div>
        <div className={classes.searchBarContainer}>
          <SearchBar onSearch={(result) => undefined} />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
