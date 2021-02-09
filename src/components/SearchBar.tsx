import {ButtonBase, IconButton, Input, makeStyles, Paper} from '@material-ui/core';
import {Close, Search} from '@material-ui/icons';
import {observer, useLocalObservable} from 'mobx-react-lite';

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(6),
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: theme.spacing(3),
  },
  searchIconBase: {
    padding: theme.spacing(1.5, 0, 1.5, 1.5),
    cursor: 'default',
    opacity: 0.66,
  },
  iconButton: {
    color: theme.palette.action.active,
    transform: 'scale(1, 1)',
    transition: theme.transitions.create(['transform', 'color'], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  iconButtonHidden: {
    transform: 'scale(0, 0)',
    '& > $icon': {
      opacity: 0,
    },
  },
  icon: {
    transition: theme.transitions.create(['opacity'], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  input: {
    width: '100%',
  },
  searchContainer: {
    margin: 'auto 0 auto 4px',
    width: `calc(100% - ${theme.spacing(6 + 4)}px)`, // 6 clear button + 4 margin
    flex: 1,
  },
}));

interface SearchBarProps {
  onSearch: (searchText: string) => void;
  className?: string;
}

const SearchBar = (props: SearchBarProps) => {
  const state = useLocalObservable(() => ({
    searchText: '',
    updateSearchText(text: string) {
      this.searchText = text;
    },
    fireSearchEvent(searchValue: string) {
      this.searchText = '';
      props.onSearch(searchValue);
    },
  }));
  const classes = useStyles();

  return (
    <Paper className={`${classes.root} ${props.className}`}>
      <ButtonBase
        disableRipple
        component="span"
        role={undefined}
        tabIndex={-1}
        className={`${classes.iconButton} ${classes.searchIconBase}`}
      >
        <Search className={classes.icon} />
      </ButtonBase>
      <div className={classes.searchContainer}>
        <Input
          className={classes.input}
          value={state.searchText}
          onChange={(e) => state.updateSearchText(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              const searchValue = state.searchText.trim();
              if (searchValue) {
                state.fireSearchEvent(searchValue);
              }
            }
          }}
          placeholder="Search Smart Spectral Matching..."
          disableUnderline
          fullWidth
        />
      </div>
      <IconButton
        onClick={() => state.updateSearchText('')}
        disabled={!state.searchText}
        className={`${classes.iconButton} ${!state.searchText.trim() && classes.iconButtonHidden}`}
      >
        <Close className={classes.icon} />
      </IconButton>
    </Paper>
  );
};

export default observer(SearchBar);
