
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar';

export default function EmpresaLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '90vh',
        backgroundColor: '#F1F7FF'
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: 3,
          overflow: 'auto'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
