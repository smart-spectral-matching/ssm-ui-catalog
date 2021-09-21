import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { ExpandMore, People } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Grid, styled, SvgIcon, Typography } from '@mui/material';

import { BatsModel } from 'types';

import { ReactComponent as AtomIcon } from 'assets/atom.svg';
import { ReactComponent as FlaskIcon } from 'assets/flask.svg';

const AccordionsContainer = styled('section')(({ theme }) => ({
  margin: theme.spacing(3, 0),
}));

const AccordionLabel = styled('span')(() => ({
  marginRight: '1em',
}));

const AccordionList = styled('ul')(() => ({
  margin: '0.5rem 0 1rem',
  border: '1px solid #e0e0e0',
  borderRadius: '10px',
  overflow: 'hidden',
  position: 'relative',
  '&:not(.browserDefault)': {
    paddingLeft: 0,
    listStyleType: 'none',
    '&>li': {
      padding: '10px',
      borderBottom: '1px solid #dddddd',
      '&:last-child': {
        border: 0,
      },
    },
  },
}));

const VideoCaption = styled('span')(({ theme }) => ({
  color: theme.palette.common.white,
  position: 'absolute',
  bottom: 0,
  left: 0,
  maxWidth: '100%',
  padding: theme.spacing(3),
  fontSize: theme.spacing(3),
}));

const Accordions: FC<Record<string, never>> = () => (
  <>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <AccordionLabel>Method</AccordionLabel>
        <SvgIcon component={FlaskIcon} viewBox="0 0 512 512" />
      </AccordionSummary>
      <AccordionDetails sx={{ flexDirection: 'column' }}>
        <AccordionList>
          <li>
            <b>Evaluation: </b> calculation
          </li>
        </AccordionList>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>calculation/1/</AccordionSummary>
          <AccordionDetails sx={{ flexDirection: 'column' }}>
            <AccordionList>
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
            </AccordionList>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>calculation/2/</AccordionSummary>
          <AccordionDetails sx={{ flexDirection: 'column' }}>
            <AccordionList>
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
            </AccordionList>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>basisset/1/</AccordionSummary>
          <AccordionDetails sx={{ flexDirection: 'column' }}>
            <AccordionList>
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
            </AccordionList>
          </AccordionDetails>
        </Accordion>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <AccordionLabel>System</AccordionLabel>
        <SvgIcon component={AtomIcon} viewBox="0 0 512 512" />
      </AccordionSummary>
      <AccordionDetails sx={{ flexDirection: 'column' }}>
        <AccordionList>
          <li>
            <b>Discipline: </b> chemistry
          </li>
          <li>
            <b>Subdiscipline: </b> computational chemistry
          </li>
          <li>
            <b>Facets: </b>
            <AccordionList>
              <li>temperature</li>
              <li>charge</li>
              <li>multiplicity</li>
              <li>space</li>
            </AccordionList>
          </li>
        </AccordionList>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <AccordionLabel>Authors</AccordionLabel>
        <People />
      </AccordionSummary>
      <AccordionDetails sx={{ flexDirection: 'column' }}>
        <AccordionList>
          <li>John Doe</li>
          <li>Jane Doe</li>
        </AccordionList>
      </AccordionDetails>
    </Accordion>
  </>
);

// TODO we will probably get rid of isSample later on
const Detail: FC<{ data: BatsModel }> = ({ data }) => (
  <>
    <Grid container spacing={4}>
      <Grid item sm={12} component="section">
        <Typography variant="h3" align="center">
          {data.scidata.property}
        </Typography>
      </Grid>
      <Grid
        item
        sm={6}
        component="section"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}
      >
        <Typography variant="body1">{data.scidata.description}</Typography>
        <AccordionList>
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
        </AccordionList>
      </Grid>
      <Grid item sm={6} component="section">
        <Card>
          <div style={{ position: 'relative' }}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video autoPlay loop style={{ borderRadius: '4px' }}>
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
            <VideoCaption>Demo Visualization</VideoCaption>
          </div>
          <CardContent>
            <Typography variant="caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    <AccordionsContainer>
      <Accordions />
    </AccordionsContainer>
  </>
);

export default observer(Detail);
