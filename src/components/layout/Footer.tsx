import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    height: '5vh',
    minHeight: theme.spacing(4),
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
}));

const Footer = () => {
  const classes = useStyles();
  return <footer className={classes.footer}>&copy;2019-2021 Smart Spectral Matching</footer>;
};

export default Footer;
