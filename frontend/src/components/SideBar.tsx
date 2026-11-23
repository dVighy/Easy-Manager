
import { useEffect, useState } from 'react';

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
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

const drawerWidth = 240;
const API = 'http://localhost:8080/api';

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

const cadastroItems = [
  {
    label: 'Clientes',
    path: 'cadastro/clientes',
    icon: <PersonAddAltOutlinedIcon />
  },
  {
    label: 'Unidades',
    path: 'cadastro/unidades',
    icon: <LocationOnOutlinedIcon />
  }
];

interface UsuarioSessao {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  ativo: boolean;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { empresaId } = useParams();

  const [perfil, setPerfil] = useState<string | null>(null);

  const basePath = `/empresa/${empresaId}`;

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      setPerfil(null);

      try {
        const usuarioSalvo = sessionStorage.getItem('easyManagerUsuario');

        if (!usuarioSalvo || !empresaId) {
          return;
        }

        const usuario: UsuarioSessao = JSON.parse(usuarioSalvo);

        const resposta = await fetch(
          `${API}/usuarios/${usuario.id}/empresa/${empresaId}/perfil`
        );

        if (!resposta.ok) {
          throw new Error('Não foi possível consultar o perfil.');
        }

        const dados = await resposta.json();

        if (ativo) {
          setPerfil(dados.perfil);
        }
      } catch (erro) {
        console.error('Erro ao carregar perfil:', erro);

        if (ativo) {
          setPerfil(null);
        }
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, [empresaId]);

  const podeGerenciarCadastros =
    perfil === 'DONO' || perfil === 'GERENTE';

  const renderizarItem = (item: {
    label: string;
    path: string;
    icon: React.ReactNode;
  }) => {
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
  };

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
        {menuItems.map(renderizarItem)}

        {podeGerenciarCadastros && (
          <>
            <Divider
              sx={{
                my: 1.5,
                borderColor: 'rgba(255,255,255,0.12)'
              }}
            />

            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                pb: 1,
                display: 'block',
                color: 'rgba(255,255,255,0.45)',
                fontWeight: 600
              }}
            >
              CADASTROS
            </Typography>

            {cadastroItems.map(renderizarItem)}
          </>
        )}
      </List>

      <Box sx={{ mt: 'auto', p: 1.5 }}>
        <Divider
          sx={{
            mb: 1,
            borderColor: 'rgba(255,255,255,0.12)'
          }}
        />

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
