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
  Radio,
  RadioGroup,
  styled,
  Theme,
  Typography,
} from '@mui/material';
import { nanoid } from 'nanoid';

import { useStore } from 'store/providers';
import { ImageContainer } from 'theme/GlobalComponents';
import { RouteHref } from 'types';

import H20 from 'assets/h20.jpeg';

enum FilterState {
  ALL = 'All',
  DATASETS = 'Datasets',
  SAMPLES = 'Samples',
}

const generateRandomCollections = (str: string) => {
  const ranDumb = Math.floor(Math.random() * 10) + 5; // from 5 to 15
  return Array.from(Array(ranDumb), (_, i) => `${str} ${i + 1}`);
};

const gridProps = (theme: Theme) => ({
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
});

const ScrollGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: gridProps(theme),
}));

const LeftScrollGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    ...gridProps(theme),
    borderRight: 0,
  },
}));

const Collection = observer((props: { title: string; values: string[]; inputName?: string }) => {
  const { title, values, inputName } = props;
  return (
    <FormControl component="fieldset" sx={{ mb: '1rem' }}>
      <FormLabel component="legend">{title}</FormLabel>
      <FormGroup>
        {values.map((value) => (
          <FormControlLabel key={nanoid()} control={<Checkbox name={inputName} />} label={value} />
        ))}
      </FormGroup>
    </FormControl>
  );
});

const LoremIpsumCard = (props: { isSample: boolean; filter: FilterState; detailLink: string }) => {
  const { isSample, filter, detailLink } = props;
  // this is a good example of a property which would normally be computed
  if ((filter === FilterState.SAMPLES && !isSample) || (filter === FilterState.DATASETS && isSample)) return null;

  return (
    <Card
      sx={{
        marginBottom: '1rem',
        display: 'flex',
      }}
      component="article"
    >
      <ImageContainer sx={{ px: '5px' }}>
        <img src={H20} alt="H20" height="59" width="100" />
      </ImageContainer>
      <CardContent>
        <Typography variant="h5">
          <Link color="primary" component={RouterLink} to={detailLink}>
            H<sub>2</sub>O
          </Link>
        </Typography>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
        <Chip
          label={isSample ? 'Sample' : 'Dataset'}
          component={RouterLink}
          to={detailLink}
          clickable
          color={!isSample ? 'primary' : 'secondary'}
        />
      </CardContent>
    </Card>
  );
};

const SearchResults = () => {
  const store = useStore();
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

  return (
    <Container
      component="main"
      sx={{
        display: 'flex',
        flexGrow: 1,
        alignItems: 'center',
      }}
      maxWidth="xl"
    >
      <Grid container spacing={1} alignContent="center">
        <LeftScrollGrid item sm={4} xs={12}>
          <FormControl component="fieldset" sx={{ mb: '1rem' }}>
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
          <Collection title="Filter By Method" inputName="methodGroup" values={state.randomMethods} />
          <Collection title="Filter By System" inputName="systemGroup" values={state.randomSystems} />
          <Collection title="Filter By Author" inputName="authorGroup" values={state.randomAuthors} />
        </LeftScrollGrid>
        <ScrollGrid item sm={8}>
          {state.randomCards.map((v) => (
            <LoremIpsumCard
              key={nanoid()}
              isSample={v.isSample}
              filter={state.filter}
              detailLink={`${RouteHref.DETAIL}/${store.dataset.selectedDataset}`}
            />
          ))}
        </ScrollGrid>
      </Grid>
    </Container>
  );
};

export default observer(SearchResults);
