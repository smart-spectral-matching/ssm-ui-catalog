import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: '2em 0 1em',
    backgroundColor: theme.palette.grey[500],
    color: theme.palette.common.white,
    textAlign: 'center',
  },
}));

const Footer = () => {
  const classes = useStyles();
  return <footer className={classes.footer}>&copy;2019-2021 Smart Spectral Matching</footer>;
};

export default Footer;
