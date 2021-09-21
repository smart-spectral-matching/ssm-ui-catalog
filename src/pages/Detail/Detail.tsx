import { FC, PropsWithChildren, ReactElement, ReactNode } from 'react';
import { ExpandMore, MultilineChart, People } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Grid, styled, SvgIcon, Typography } from '@mui/material';
import { nanoid } from 'nanoid';

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

/**
 * Display simple object
 */
const AccordionListItem: FC<PropsWithChildren<{ objKey: string }>> = ({ objKey, children }) => (
  <li>
    <b>{objKey}:</b> {children}
  </li>
);

/**
 *
 * Creates an accordion
 *
 */
const TopLevelAccordion: FC<PropsWithChildren<{ label: string; icon?: ReactElement<any, any> }>> = ({ label, icon, children }) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <AccordionLabel>{label}</AccordionLabel>
      {icon}
    </AccordionSummary>
    <AccordionDetails sx={{ flexDirection: 'column' }}>
      <AccordionList>{children}</AccordionList>
    </AccordionDetails>
  </Accordion>
);

/**
 *
 * Dynamically generate a component based on the type of "value" . Recursive function.
 *
 * Icon is an optional property, but it will not be passed recursively down the tree.
 *
 * TODO "topLevel" is a hack to stop accordions with custom icons from rendering as list items
 * (SHOULD be able to just check if "icon" is undefined, but that doesn't seem to work)
 *
 */
const DynamicAccordionProps: FC<{ label: string; value: any; icon?: ReactElement<any, any>; topLevel?: boolean }> = ({
  label,
  value,
  icon,
  topLevel,
}) => {
  if (Array.isArray(value)) {
    const arrayChildren = value.map((arrayValue, idx) => (
      <li key={`${label}-${nanoid()}`}>
        <DynamicAccordionProps label={`${label} (${idx + 1})`} value={arrayValue} />
      </li>
    ));
    return topLevel ? (
      <TopLevelAccordion label={label} icon={icon}>
        {arrayChildren}
      </TopLevelAccordion>
    ) : (
      <li>
        <AccordionList>{arrayChildren}</AccordionList>
      </li>
    );
  }
  if (typeof value === 'object' && value !== null) {
    // MUST check array before object - "null" is also an object
    return (
      <li>
        <TopLevelAccordion label={label} icon={icon}>
          {Object.entries(value).map(([objLabel, objValue]) => (
            <DynamicAccordionProps key={objLabel} label={objLabel} value={objValue} />
          ))}
        </TopLevelAccordion>
      </li>
    );
  }
  if (typeof value === 'boolean') {
    // React cannot render boolean values, so convert value to a string
    return <AccordionListItem objKey={label}>{value.toString()}</AccordionListItem>;
  }
  // indicates string, number, or null
  return <AccordionListItem objKey={label}>{value as ReactNode}</AccordionListItem>;
};

const Detail: FC<{ data: BatsModel }> = ({ data }) => (
  <>
    <Grid container spacing={4}>
      <Grid item sm={12} component="section">
        <Typography variant="h3" align="center">
          {data.title}
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
        {data.scidata.property && (
          <>
            <Typography variant="h4">Property</Typography>
            <Typography variant="body1">{data.scidata.property}</Typography>
          </>
        )}
        {data.scidata.description && (
          <>
            <Typography variant="h4">Description</Typography>
            <Typography variant="body1">{data.scidata.description}</Typography>
          </>
        )}
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
              Video caption goes here. The video will likely be replaced by an image later on. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    <AccordionsContainer>
      {data.scidata.dataseries && (
        <DynamicAccordionProps label="Dataseries" value={data.scidata.dataseries} icon={<MultilineChart />} topLevel />
      )}
      {data.scidata.methodology && (
        <DynamicAccordionProps
          label="Method"
          value={data.scidata.methodology}
          icon={<SvgIcon component={FlaskIcon} viewBox="0 0 512 512" />}
          topLevel
        />
      )}
      {data.scidata.system && (
        <DynamicAccordionProps
          label="System"
          value={data.scidata.system}
          icon={<SvgIcon component={AtomIcon} viewBox="0 0 512 512" />}
          topLevel
        />
      )}
      {data.scidata.sources && <DynamicAccordionProps label="Authors" value={data.scidata.sources} icon={<People />} topLevel />}
    </AccordionsContainer>
  </>
);

export default Detail;
