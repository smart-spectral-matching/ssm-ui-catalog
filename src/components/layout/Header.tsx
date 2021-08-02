import {makeStyles, AppBar, Link, List, ListItem, ListItemText, Menu, MenuItem, Toolbar, Typography} from '@material-ui/core';
import {useState} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';

import LOGO from 'assets/logo.png';
import {RouteHref} from 'types';
import SearchBar from 'components/SearchBar';
import {API_DOCS_URL, MACHINE_LEARNING_URL} from 'ssm-constants';

const DOCS_MENU_ID = 'docs-menu-id';

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
  wrapperContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.between('xs', 'sm')]: {
      flexDirection: 'column',
    },
  },
  searchBarContainer: {
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  linkContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const Header = () => {
  const history = useHistory();
  const classes = useStyles();

  const [docsMenu, setDocsMenu] = useState<(EventTarget & HTMLElement) | null>(null);

  return (
    <AppBar color="secondary" position="static" component="header" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.imageContainer}>
          <Link className={classes.logo} component={RouterLink} to={RouteHref.HOME}>
            <img src={LOGO} alt="Smart Spectral Matching - Home" width="100" height="67" />
          </Link>
        </div>
        <div className={classes.wrapperContainer}>
          <div className={classes.searchBarContainer}>
            <SearchBar onSearch={(result) => history.push(`${RouteHref.SEARCH}/${result}`)} />
          </div>
          <List className={classes.linkContainer}>
            <ListItem>
              <Link component={RouterLink} to={RouteHref.HOME} color="inherit">
                HOME
              </Link>
            </ListItem>
            <ListItem>
              <Link component={RouterLink} to={RouteHref.ABOUT} color="inherit">
                ABOUT
              </Link>
            </ListItem>
            <ListItem>
              <Link href={MACHINE_LEARNING_URL} color="inherit">
                TRAINING
              </Link>
            </ListItem>
            <ListItem
              button
              aria-owns={docsMenu ? DOCS_MENU_ID : undefined}
              onClick={(e) => docsMenu !== e.currentTarget && setDocsMenu(e.currentTarget)}
            >
              <ListItemText
                primary={
                  <Typography variant="body2" color="inherit">
                    DOCS&nbsp;▾
                  </Typography>
                }
              />
            </ListItem>
            <Menu
              id={DOCS_MENU_ID}
              anchorEl={docsMenu}
              open={!!docsMenu}
              onClose={() => setDocsMenu(null)}
              getContentAnchorEl={null} // needed for menu to appear below, see https://stackoverflow.com/a/52551100
              anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
              transformOrigin={{vertical: 'top', horizontal: 'center'}}
            >
              <MenuItem component={Link} href={API_DOCS_URL} onClick={() => setDocsMenu(null)} color="inherit">
                API
              </MenuItem>
            </Menu>
          </List>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
