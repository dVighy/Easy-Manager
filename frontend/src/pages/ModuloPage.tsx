
import { Box, Typography, Paper } from '@mui/material';

interface ModuloPageProps {
  titulo: string;
}

export default function ModuloPage({ titulo }: ModuloPageProps) {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} color="#1E1E2F">
        {titulo}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        EstacionaFácil / {titulo}
      </Typography>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 4,
          borderRadius: 3,
          backgroundColor: '#FFFFFF',
          minHeight: 300
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Módulo em desenvolvimento.
        </Typography>
      </Paper>
    </Box>
  );
}
