import { createTheme, PaletteMode, responsiveFontSizes, ThemeOptions, unstable_createMuiStrictModeTheme } from '@mui/material';

const theme = (mode?: PaletteMode) => {
  const options = {
    palette: {
      mode,
      primary: {
        main: '#b71c1c',
      },
      secondary: {
        main: '#777777',
        contrastText: '#fff',
      },
    },
    components: {
      MuiFormControl: {
        defaultProps: {
          variant: 'standard',
        },
        styleOverrides: {
          root: {
            border: '2px groove',
            borderRadius: '10px',
            margin: '0 -4px',
            width: '100%',
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            marginLeft: '11px',
            marginRight: 0,
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            padding: '0 2px',
          },
        },
      },
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
      },
      MuiSelect: {
        defaultProps: {
          variant: 'standard',
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'standard',
        },
      },
    },
  } as ThemeOptions;
  // development/testing needs a separate import to avoid React Strict mode warnings
  const themeGenerator = process.env.NODE_ENV === 'production' ? createTheme : unstable_createMuiStrictModeTheme;
  return themeGenerator(options);
};

export default function makeTheme(mode?: PaletteMode) {
  return responsiveFontSizes(theme(mode));
}
