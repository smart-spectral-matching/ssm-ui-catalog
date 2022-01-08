import { useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Close, Search } from '@mui/icons-material';
import { ButtonBase, IconButton, Input, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled(Paper)(({ theme }) => ({
  height: theme.spacing(6),
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: theme.spacing(3),
}));

const SearchIconBase = styled(ButtonBase)(({ theme }) => ({
  padding: theme.spacing(1.5, 0, 1.5, 1.5),
  cursor: 'default',
  opacity: 0.66,
}));

const SearchIcon = styled(Search)(({ theme }) => ({
  transition: theme.transitions.create(['opacity'], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  }),
}));

const SearchContainer = styled('div')(({ theme }) => ({
  margin: 'auto 0 auto 4px',
  width: `calc(100% - ${theme.spacing(6 + 4)}px)`, // 6 clear button + 4 margin
  flex: 1,
}));

const ClearIconButton = styled(IconButton)(({ disabled, theme }) => ({
  color: theme.palette.action.active,
  transform: disabled ? 'scaled(0, 0' : 'scale(1, 1)',
  transition: theme.transitions.create(['transform', 'color'], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  }),
}));

const ClearIcon = styled(Close)<{ $enabled?: boolean }>(({ $enabled, theme }) => ({
  opacity: $enabled ? 1 : 0,
  transition: theme.transitions.create(['opacity'], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  }),
}));

interface SearchBarProps {
  onSearch: (searchText: string) => void;
}

const SearchBar = (props: SearchBarProps) => {
  const inputEl = useRef<HTMLInputElement>();
  const state = useLocalObservable(() => ({
    searchText: '',
    get sanitizedSearchText() {
      return state.searchText.trim();
    },
    updateSearchText(text: string) {
      state.searchText = text;
    },
    fireSearchEvent() {
      if (state.sanitizedSearchText) props.onSearch(state.sanitizedSearchText);
      state.searchText = '';
    },
  }));

  return (
    <Root>
      <SearchIconBase disableRipple as="span" role={undefined} tabIndex={-1}>
        <SearchIcon />
      </SearchIconBase>
      <SearchContainer>
        <Input
          inputProps={{ ref: inputEl }}
          value={state.searchText}
          onChange={(e) => state.updateSearchText(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              state.fireSearchEvent();
            }
          }}
          placeholder="Search Smart Spectral Matching..."
          disableUnderline
          fullWidth
        />
      </SearchContainer>
      <ClearIconButton
        onClick={() => {
          state.updateSearchText('');
          inputEl.current?.focus();
        }}
        disabled={!state.sanitizedSearchText}
      >
        <ClearIcon $enabled={!!state.sanitizedSearchText} />
      </ClearIconButton>
    </Root>
  );
};

export default observer(SearchBar);
