import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { AppBar, Link, List, ListItem, ListItemText, Menu, MenuItem, styled, Toolbar, Typography } from '@mui/material';

import LoginPanel from 'components/LoginPanel';
import SearchBar from 'components/SearchBar';
import { API_URL, ML_NOTEBOOKS_URL, ML_UI_URL } from 'ssm-constants';
import { ImageContainer } from 'theme/GlobalComponents';
import { RouteHref } from 'types';

import LOGO from 'assets/logo.svg';

const ML_MENU_ID = 'ml-menu-id';
const DOCS_MENU_ID = 'docs-menu-id';
const LOGIN_MENU_ID = 'login-menu-id';

const HeaderToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'space-around',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
  [theme.breakpoints.between('xs', 'md')]: {
    justifyContent: 'space-between',
  },
}));

const WrapperContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.between('xs', 'md')]: {
    flexDirection: 'column',
  },
}));

const SearchBarContainer = styled('div')(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const Header = () => {
  const history = useHistory();

  const [mlMenu, setMlMenu] = useState<(EventTarget & HTMLElement) | null>(null);
  const [docsMenu, setDocsMenu] = useState<(EventTarget & HTMLElement) | null>(null);
  const [loginMenu, setLoginMenu] = useState<(EventTarget & HTMLElement) | null>(null);

  const auth = useAuth();

  useEffect(() => {
    setLoginMenu(null);
  }, [auth.isAuthenticated]);

  return (
    <AppBar sx={{ mb: 3, py: 1 }} color="secondary" position="static" component="header">
      <HeaderToolbar>
        <ImageContainer sx={{ marginRight: '.5rem' }}>
          <Link sx={{ maxWidth: '15%' }} component={RouterLink} to={RouteHref.HOME}>
            <img src={LOGO} alt="Smart Spectral Matching - Home" width="200" height="80" />
          </Link>
        </ImageContainer>
        <WrapperContainer>
          <SearchBarContainer>
            <SearchBar onSearch={(result) => history.push(`${RouteHref.SEARCH}/${result}`)} />
          </SearchBarContainer>
          <List sx={{ display: 'flex', flexDirection: 'row' }}>
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
            <ListItem
              button
              aria-owns={mlMenu ? ML_MENU_ID : undefined}
              onClick={(e) => mlMenu !== e.currentTarget && setMlMenu(e.currentTarget)}
            >
              <ListItemText
                primary={
                  <Typography variant="body2" color="inherit">
                    MACHINE LEARNING&nbsp;▾
                  </Typography>
                }
              />
            </ListItem>
            <Menu
              id={ML_MENU_ID}
              anchorEl={mlMenu}
              open={!!mlMenu}
              onClose={() => setMlMenu(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <MenuItem component={Link} href={ML_UI_URL} onClick={() => setMlMenu(null)} color="inherit">
                UI
              </MenuItem>
              <MenuItem component={Link} href={ML_NOTEBOOKS_URL} onClick={() => setMlMenu(null)} color="inherit">
                JUPYTER NOTEBOOKS
              </MenuItem>
            </Menu>
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
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <MenuItem component={Link} href={`${API_URL}/swagger-ui/`} onClick={() => setDocsMenu(null)} color="inherit">
                API
              </MenuItem>
            </Menu>
            <ListItem
              button
              aria-owns={loginMenu ? LOGIN_MENU_ID : undefined}
              onClick={(e) => loginMenu !== e.currentTarget && setLoginMenu(e.currentTarget)}
            >
              <ListItemText
                primary={
                  auth.isAuthenticated ? (
                    <Typography variant="body2" color="inherit">
                      LOG OUT&nbsp;
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="inherit">
                      LOG IN&nbsp;
                    </Typography>
                  )
                }
              />
            </ListItem>
            <LoginPanel id={LOGIN_MENU_ID} open={!!loginMenu} onClose={() => setLoginMenu(null)} />
          </List>
        </WrapperContainer>
      </HeaderToolbar>
    </AppBar>
  );
};

export default Header;
