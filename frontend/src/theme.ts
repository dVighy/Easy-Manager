import { createTheme } from '@mui/material/styles';

// Tema inicial neutro. A identidade visual do Easy Manager pode ser definida aqui.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#aa19d2' },
    secondary: { main: '#8302ed' },
    background: { default: '#f7f9fc' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
  },
});

export default theme;
