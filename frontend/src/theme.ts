import { createTheme } from '@mui/material/styles';

// Tema inicial neutro. A identidade visual do Easy Manager pode ser definida aqui.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#ed6c02' },
    background: { default: '#f7f9fc' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
  },
});

export default theme;
