
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  {
    label: 'Dashboard',
    path: 'dashboard',
    icon: <DashboardOutlinedIcon />
  },
  {
    label: 'Operacional',
    path: 'operacional',
    icon: <DirectionsCarOutlinedIcon />
  },
  {
    label: 'Financeiro',
    path: 'financeiro',
    icon: <AccountBalanceWalletOutlinedIcon />
  },
  {
    label: 'Funcionários',
    path: 'funcionarios',
    icon: <GroupsOutlinedIcon />
  },
  {
    label: 'Avaliações',
    path: 'avaliacoes',
    icon: <RateReviewOutlinedIcon />
  },
  {
    label: 'Relatórios',
    path: 'relatorios',
    icon: <AssessmentOutlinedIcon />
  }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { empresaId } = useParams();

  const basePath = `/empresa/${empresaId}`;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'relative',
          height: '100%',
          backgroundColor: '#1E1E2F',
          color: '#FFFFFF',
          borderRight: 'none'
        }
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessOutlinedIcon />
          <Typography variant="subtitle1" fontWeight={600}>
            EstacionaFácil
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: 'rgba(255,255,255,0.55)' }}
        >
          Ambiente empresarial
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const selected =
            location.pathname === `${basePath}/${item.path}`;

          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => navigate(`${basePath}/${item.path}`)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: 'rgba(255,255,255,0.8)',
                '& .MuiListItemIcon-root': {
                  color: 'inherit',
                  minWidth: 38
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.14)',
                  color: '#FFFFFF'
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'rgba(255,255,255,0.20)'
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: selected ? 600 : 400
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 1.5 }}>
        <Divider sx={{ mb: 1, borderColor: 'rgba(255,255,255,0.12)' }} />

        <ListItemButton
          onClick={() => navigate('/')}
          sx={{
            borderRadius: 2,
            color: 'rgba(255,255,255,0.75)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.08)'
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>
            <BusinessOutlinedIcon />
          </ListItemIcon>

          <ListItemText
            primary="Minhas empresas"
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}
