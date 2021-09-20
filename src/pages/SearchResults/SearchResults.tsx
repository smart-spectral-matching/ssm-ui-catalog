import { Link as RouterLink } from 'react-router-dom';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Link,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { nanoid } from 'nanoid';

import H20 from 'assets/h20.jpeg';
import { RouteHref } from 'types';

enum FilterState {
  ALL = 'All',
  DATASETS = 'Datasets',
  SAMPLES = 'Samples',
}

const generateRandomCollections = (str: string) => {
  const ranDumb = Math.floor(Math.random() * 10) + 5; // from 5 to 15
  return Array.from(Array(ranDumb), (_, i) => `${str} ${i + 1}`);
};

const useStyles = makeStyles((theme) => ({
  fieldset: {
    marginBottom: '1rem',
  },
  card: {
    marginBottom: '1rem',
    display: 'flex',
  },
  imageWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 5px',
  },
  scrollGrid: {
    [theme.breakpoints.up('sm')]: {
      maxHeight: '50vh',
      overflowY: 'auto',
      overflowX: 'hidden', // stupid Chrome bug
      border: `3px solid ${theme.palette.grey[300]}`,
      scrollbarWidth: 'thin', // Firefox
      '&::-webkit-scrollbar': {
        // Chrome
        width: '7px',
      },
      '&::-webkit-scrollbar-track': {
        // Chrome
        boxShadow: 'inset 0 0 6px rgba(255, 255, 255, 0.3)',
      },
      '&::-webkit-scrollbar-thumb': {
        // Chrome
        backgroundColor: `${theme.palette.grey[800]}`,
        outline: `1px solid ${theme.palette.grey[400]}`,
      },
      '@media (min-height: 450px)': {
        maxHeight: '60vh',
      },
      '@media (min-height: 600px)': {
        maxHeight: '70vh',
      },
      '@media (min-height: 750px)': {
        maxHeight: '75vh',
      },
      '@media (min-height: 900px)': {
        maxHeight: '80vh',
      },
    },
  },
  scrollGridL: {
    [theme.breakpoints.up('sm')]: {
      borderRight: 0,
    },
  },
  container: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
  },
}));

const Collection = observer((props: { classes: ReturnType<typeof useStyles>; title: string; values: string[]; inputName?: string }) => {
  const { classes, title, values, inputName } = props;
  return (
    <FormControl component="fieldset" className={classes.fieldset}>
      <FormLabel component="legend">{title}</FormLabel>
      <FormGroup>
        {values.map((value) => (
          <FormControlLabel key={nanoid()} control={<Checkbox name={inputName} />} label={value} />
        ))}
      </FormGroup>
    </FormControl>
  );
});

const LoremIpsumCard = (props: { classes: ReturnType<typeof useStyles>; isSample: boolean; filter: FilterState }) => {
  const { classes, isSample, filter } = props;
  // this is a good example of a property which would normally be computed
  const isVisible =
    filter === FilterState.ALL || (isSample && filter === FilterState.SAMPLES) || (!isSample && filter === FilterState.DATASETS);
  if (!isVisible) return <></>;

  const example = isSample ? { url: RouteHref.DETAIL_SAMPLE, display: 'Sample' } : { url: RouteHref.DETAIL_DATASET, display: 'Dataset' };

  return (
    <Card className={classes.card} component="article">
      <div className={classes.imageWrapper}>
        <img src={H20} alt="H20" height="59" width="100" />
      </div>
      <CardContent>
        <Typography variant="h5">
          <Link color="primary" component={RouterLink} to={example.url}>
            H<sub>2</sub>O
          </Link>
        </Typography>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
        <Chip label={example.display} component={RouterLink} to={example.url} clickable color={!isSample ? 'primary' : 'secondary'} />
      </CardContent>
    </Card>
  );
};

const SearchResults = () => {
  const state = useLocalObservable(() => ({
    filter: FilterState.ALL,
    updateFilter(filter: FilterState) {
      state.filter = filter;
    },
    /*
     * NOTE: Do not directly set JSX attributes derived from Math.random(), because ANY state change forces them to rerender
     */
    randomCards: Array.from(Array(Math.floor(Math.random() * 10) + 10), () => ({
      isSample: Math.random() >= 0.5,
    })),
    randomMethods: generateRandomCollections('Method'),
    randomSystems: generateRandomCollections('System'),
    randomAuthors: generateRandomCollections('Author'),
  }));
  const classes = useStyles();

  return (
    <Container component="main" className={classes.container}>
      <Grid container spacing={4} alignContent="center">
        <Grid item sm={4} xs={12} className={`${classes.scrollGrid} ${classes.scrollGridL}`}>
          <FormControl component="fieldset" className={classes.fieldset}>
            <FormLabel component="legend">Filter By Type</FormLabel>
            <RadioGroup
              aria-label="type"
              name="type"
              value={state.filter}
              onChange={(e) => state.updateFilter(e.target.value as FilterState)}
            >
              {Object.values(FilterState).map((value) => (
                <FormControlLabel key={value} value={value} control={<Radio />} label={value} />
              ))}
            </RadioGroup>
          </FormControl>
          <Collection classes={classes} title="Filter By Method" inputName="methodGroup" values={state.randomMethods} />
          <Collection classes={classes} title="Filter By System" inputName="systemGroup" values={state.randomSystems} />
          <Collection classes={classes} title="Filter By Author" inputName="authorGroup" values={state.randomAuthors} />
        </Grid>
        <Grid item sm={8} className={classes.scrollGrid}>
          {state.randomCards.map((v) => (
            <LoremIpsumCard key={nanoid()} classes={classes} isSample={v.isSample} filter={state.filter} />
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default observer(SearchResults);
