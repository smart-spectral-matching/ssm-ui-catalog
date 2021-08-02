import {unstable_createMuiStrictModeTheme as createMuiTheme, responsiveFontSizes, PaletteType} from '@material-ui/core';

const theme = (color?: PaletteType) =>
  createMuiTheme({
    palette: {
      type: color,
      primary: {
        main: '#b71c1c',
      },
      secondary: {
        main: '#777777',
        contrastText: '#fff',
      },
    },
    overrides: {
      MuiFormControl: {
        root: {
          border: '2px groove',
          borderRadius: '10px',
          margin: '0 2px',
          width: '100%',
        },
      },
      MuiFormLabel: {
        root: {
          padding: '0 2px',
        },
      },
      MuiFormControlLabel: {
        root: {
          marginLeft: '11px',
          marginRight: 0,
        },
      },
    },
  });

export default function makeTheme(color?: PaletteType) {
  return responsiveFontSizes(theme(color));
}
