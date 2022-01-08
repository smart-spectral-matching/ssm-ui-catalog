import { FC, PropsWithChildren, ReactElement, ReactNode } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { ExpandMore, KeyboardArrowLeft, KeyboardArrowRight, MultilineChart, People } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonGroup,
  Card,
  Grid,
  IconButton,
  styled,
  SvgIcon,
  Typography,
} from '@mui/material';
import { nanoid } from 'nanoid';

import ZoomableLineChart from 'components/graphs/ZoomableLineChart';
import { BatsModel } from 'types';
import { isNonEmptyArray, isNonEmptyObject } from 'utils';

import { ReactComponent as AtomIcon } from 'assets/atom.svg';
import { ReactComponent as FlaskIcon } from 'assets/flask.svg';

const AccordionsContainer = styled('section')(({ theme }) => ({
  margin: theme.spacing(3, 0),
}));

const AccordionLabel = styled('span')(() => ({
  marginRight: '1em',
}));

const AccordionList = styled('ul', { shouldForwardProp: (prop) => prop !== 'needsScroll' })<{ needsScroll?: boolean }>(
  ({ needsScroll }) => ({
    margin: '0.5rem 0 1rem',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    maxHeight: needsScroll ? '25vh' : 'unset',
    overflowY: 'auto',
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
  }),
);

const DataseriesDisplay = styled('span')(() => ({
  display: 'inline-flex',
  alignItems: 'center',
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
 * Icon is an optional property, but it will not be passed recursively down the tree. If "icon" is defined, it assumes the highest-level accordion.
 *
 */
const DynamicAccordionProps: FC<{ label: string; value: unknown; icon?: ReactElement<any, any> }> = ({ label, value, icon }) => {
  if (Array.isArray(value)) {
    const arrayChildren = value.map((arrayValue, idx) => (
      <li key={`${label}-${nanoid()}`}>
        <DynamicAccordionProps label={`${label} (${idx + 1})`} value={arrayValue} />
      </li>
    ));
    return icon ? (
      <TopLevelAccordion label={label} icon={icon}>
        {arrayChildren}
      </TopLevelAccordion>
    ) : (
      <li>
        <AccordionList needsScroll={arrayChildren.length > 10}>{arrayChildren}</AccordionList>
      </li>
    );
  }
  if (typeof value === 'object' && value !== null) {
    // MUST check array before object - "null" is also an object

    const objectChildren = (
      <TopLevelAccordion label={label} icon={icon}>
        {Object.entries(value)
          .sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase(), 'en'))
          .map(([objLabel, objValue]) => (
            <DynamicAccordionProps key={objLabel} label={objLabel} value={objValue} />
          ))}
      </TopLevelAccordion>
    );

    return icon ? objectChildren : <li>{objectChildren}</li>;
  }
  if (typeof value === 'boolean') {
    // React cannot render boolean values, so convert value to a string
    return <AccordionListItem objKey={label}>{value.toString()}</AccordionListItem>;
  }
  // indicates string, number, or null
  return <AccordionListItem objKey={label}>{value as ReactNode}</AccordionListItem>;
};

const Detail: FC<{ data: BatsModel }> = ({ data }) => {
  const state = useLocalObservable(() => ({
    activeDataseriesIdx: 0,
    get selectedDataseries() {
      const dataseries = data.scidata.dataseries;
      if (!isNonEmptyArray(dataseries)) return null;
      return dataseries![state.activeDataseriesIdx];
    },
  }));

  return (
    <>
      <Grid container spacing={4}>
        <Grid item sm={12} component="section">
          <Typography variant="h3" align="center">
            {data.title}
          </Typography>
        </Grid>
        <Grid
          item
          md={4}
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
        <Grid item md={8} component="section" sx={{ width: '100%' }}>
          <Card>
            {!!state.selectedDataseries && (
              <ZoomableLineChart dataseries={state.selectedDataseries}>
                <ButtonGroup variant="outlined" aria-label="Switch Dataset">
                  <IconButton
                    aria-label="previous"
                    title="Go to previous dataset"
                    disabled={state.activeDataseriesIdx === 0}
                    onClick={() => (state.activeDataseriesIdx -= 1)}
                  >
                    <KeyboardArrowLeft />
                  </IconButton>
                  <DataseriesDisplay>
                    {`Dataseries ${state.activeDataseriesIdx + 1} of ${data.scidata.dataseries!.length}`}
                  </DataseriesDisplay>
                  <IconButton
                    aria-label="next"
                    title="Go to next dataset"
                    disabled={state.activeDataseriesIdx === data.scidata.dataseries!.length - 1}
                    onClick={() => (state.activeDataseriesIdx += 1)}
                  >
                    <KeyboardArrowRight />
                  </IconButton>
                </ButtonGroup>
              </ZoomableLineChart>
            )}
          </Card>
        </Grid>
      </Grid>
      <AccordionsContainer>
        {isNonEmptyArray(data.scidata.dataseries) && (
          <DynamicAccordionProps label="Dataseries" value={data.scidata.dataseries} icon={<MultilineChart />} />
        )}
        {isNonEmptyObject(data.scidata.methodology) && (
          <DynamicAccordionProps
            label="Method"
            value={data.scidata.methodology}
            icon={<SvgIcon component={FlaskIcon} viewBox="0 0 512 512" />}
          />
        )}
        {isNonEmptyObject(data.scidata.system) && (
          <DynamicAccordionProps label="System" value={data.scidata.system} icon={<SvgIcon component={AtomIcon} viewBox="0 0 512 512" />} />
        )}
        {isNonEmptyObject(data.scidata.sources) && <DynamicAccordionProps label="Authors" value={data.scidata.sources} icon={<People />} />}
      </AccordionsContainer>
    </>
  );
};

export default observer(Detail);
