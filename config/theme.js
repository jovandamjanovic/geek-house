import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#c5975c',
    },
    secondary: {
      main: '#bacbe4',
    },
    error: {
      main: red.A400,
    },
  },
});
export default theme;
