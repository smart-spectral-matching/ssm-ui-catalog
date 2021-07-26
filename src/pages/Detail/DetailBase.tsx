import {
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Grid,
  SvgIcon,
  Typography,
  Card,
  CardContent,
} from '@material-ui/core';
import {ExpandMore, People} from '@material-ui/icons';
import {observer} from 'mobx-react-lite';
import {FC, useEffect} from 'react';
import {useQuery, UseQueryResult} from 'react-query';

import {ReactComponent as AtomIcon} from 'assets/atom.svg';
import {ReactComponent as FlaskIcon} from 'assets/flask.svg';
import {DetailsProps} from './DetailProps';

const useStyles = makeStyles((theme) => ({
  accordionContainer: {
    margin: theme.spacing(3, 0),
  },
  accordionLabel: {
    marginRight: '1em',
  },
  accordionDetails: {
    flexDirection: 'column',
  },
  withBorderRadius: {
    borderRadius: '4px',
  },
  videoContainer: {
    position: 'relative',
  },
  videoCaption: {
    color: theme.palette.common.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    maxWidth: '100%',
    padding: theme.spacing(3),
    fontSize: theme.spacing(3),
  },
  leftGrid: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  list: {
    margin: '0.5rem 0 1rem',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative',
    '&:not(.browserDefault)': {
      paddingLeft: 0,
      'list-style-type': 'none',
      '&>li': {
        padding: '10px',
        borderBottom: '1px solid #dddddd',
        '&:last-child': {
          border: 0,
        },
      },
    },
  },
}));

const Accordions = (props: {classes: ReturnType<typeof useStyles>; isSample?: boolean}) => {
  const {classes, isSample} = props;
  return (
    <>
      {!isSample && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <span className={classes.accordionLabel}>Method</span>
            <SvgIcon component={FlaskIcon} viewBox="0 0 512 512" />
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            <ul className={classes.list}>
              <li>
                <b>Evaluation: </b> calculation
              </li>
            </ul>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>calculation/1/</AccordionSummary>
              <AccordionDetails className={classes.accordionDetails}>
                <ul className={classes.list}>
                  <li>
                    <b>Approach: </b> Quantum Mechanics
                  </li>
                  <li>
                    <b>Calc Class: </b> ab initio
                  </li>
                  <li>
                    <b>Calc Type: </b> ab ccsd(t)
                  </li>
                  <li>
                    <b>Sub Method: </b> calculation/2/
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>calculation/2/</AccordionSummary>
              <AccordionDetails className={classes.accordionDetails}>
                <ul className={classes.list}>
                  <li>
                    <b>Approach: </b> Quantum Mechanics
                  </li>
                  <li>
                    <b>Calc Class: </b> ab initio
                  </li>
                  <li>
                    <b>Calc Type: </b> ab ccsd(t)
                  </li>
                  <li>
                    <b>Sub Method: </b> calculation/2/
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>basisset/1/</AccordionSummary>
              <AccordionDetails className={classes.accordionDetails}>
                <ul className={classes.list}>
                  <li>
                    <b>Title: </b> 3-21G
                  </li>
                  <li>
                    <b>Description: </b> A test BSE basis set
                  </li>
                  <li>
                    <b>Format: </b> orbital
                  </li>
                  <li>
                    <b>Set Type: </b> Quantum Mechanics
                  </li>
                  <li>
                    <b>Harmonic Type: </b> Spherical
                  </li>
                  <li>
                    <b>Contraction Type: </b> general
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </AccordionDetails>
        </Accordion>
      )}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <span className={classes.accordionLabel}>System</span>
          <SvgIcon component={AtomIcon} viewBox="0 0 512 512" />
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <ul className={classes.list}>
            <li>
              <b>Discipline: </b> chemistry
            </li>
            <li>
              <b>Subdiscipline: </b> computational chemistry
            </li>
            <li>
              <b>Facets: </b>
              <ul className={classes.list}>
                <li>temperature</li>
                <li>charge</li>
                <li>multiplicity</li>
                <li>space</li>
              </ul>
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <span className={classes.accordionLabel}>Authors</span>
          <People />
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <ul className={classes.list}>
            <li>John Doe</li>
            <li>Jane Doe</li>
          </ul>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

// TODO we will probably get rid of isSample later on
const DetailBase: FC<DetailsProps & {isSample?: boolean}> = ({dataset, model, isSample}) => {
  const classes = useStyles();

  // TODO temporarily log the result from the model UUID until we decide how to parse it
  const query: UseQueryResult<any, any> = useQuery(`/datasets/${dataset}/models/${model}`);
  useEffect(() => {
    if (query.isFetched) {
      query.error ? window.console.error(query.error) : window.console.log(query.data);
    }
  }, [query.isFetched]);

  return (
    <Container component="main">
      <Grid container spacing={4}>
        <Grid item sm={12} component="section">
          <Typography variant="h3" align="center">
            H<sub>2</sub>O {isSample && 'Sample'}
          </Typography>
        </Grid>
        <Grid item sm={6} component="section" className={classes.leftGrid}>
          <Typography variant="body1">
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
            vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.
            Mauris placerat eleifend leo.
          </Typography>
          <ul className={classes.list}>
            <li>
              <Typography variant="caption" title="Lorum ipsum dolor sit amet">
                Lorem
              </Typography>
            </li>
            <li>
              <Typography variant="caption" title="Aliquam tincidunt mauris eu risus">
                Aliquam
              </Typography>
            </li>
            <li>
              <Typography variant="caption" title="Morbi in sem quis dui placerat ornare">
                Morbi
              </Typography>
            </li>
            <li>
              <Typography variant="caption" title="Praesent dapibus, neque id cursus faucibus">
                Praesent
              </Typography>
            </li>
            <li>
              <Typography variant="caption" title="Pellentesque fermentum dolor">
                Pellentesque
              </Typography>
            </li>
          </ul>
        </Grid>
        <Grid item sm={6} component="section">
          <Card>
            <div className={classes.videoContainer}>
              <video autoPlay loop className={classes.withBorderRadius}>
                <source
                  src="https://ak6.picdn.net/shutterstock/videos/1012853036/preview/stock-footage-animation-rotation-of-model-molecule-from-glass-and-crystal.webm"
                  type="video/mp4"
                />
                <source
                  src="https://ak6.picdn.net/shutterstock/videos/1012853036/preview/stock-footage-animation-rotation-of-model-molecule-from-glass-and-crystal.webm"
                  type="video/ogg"
                />
                Your browser does not support the video tag.
              </video>
              <span className={classes.videoCaption}>Demo Visualization</span>
            </div>
            <CardContent>
              <Typography variant="caption">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <section className={classes.accordionContainer}>
        <Accordions classes={classes} isSample={isSample} />
      </section>
    </Container>
  );
};

export default observer(DetailBase);
