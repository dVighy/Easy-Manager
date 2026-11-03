
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Avatar
} from '@mui/material';

import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocalParkingOutlinedIcon from '@mui/icons-material/LocalParkingOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const empresas = [
    {
      id: 'estacionafacil',
      nome: 'EstacionaFácil',
      segmento: 'Estacionamento',
      descricao:
        'Gerenciamento operacional, acompanhamento financeiro e análise da satisfação dos clientes.',
      icon: <LocalParkingOutlinedIcon />,
      status: 'Ativo'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '90vh',
        backgroundColor: '#F1F7FF',
        p: { xs: 2, md: 4 }
      }}
    >
      {/* Cabeçalho */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#1E1E2F"
            align='left'
          >
            Minhas empresas
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Selecione uma empresa para acessar seu ambiente de gerenciamento.
          </Typography>
        </Box>

        <Chip
          icon={<BusinessOutlinedIcon />}
          label={`${empresas.length} empresa cadastrada`}
          sx={{
            backgroundColor: '#E1EAF8',
            color: '#1E1E2F',
            fontWeight: 600,
            borderRadius: 2
          }}
        />
      </Box>

      {/* Apresentação */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          backgroundColor: '#1E1E2F',
          color: '#FFFFFF',
          mb: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              color: '#A9BDE0',
              letterSpacing: 2
            }}
          >
            EASY MANAGER
          </Typography>

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mt: 1, mb: 1 }}
          >
            Gestão integrada em um só lugar.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.75)',
              maxWidth: 650,
              lineHeight: 1.7,
              justifyContent: 'center',
              textAlign: 'center', 
              mx: 'auto'
            }}
          >
            Centralize informações, acompanhe indicadores
            e gerencie diferentes empresas por meio de
            ambientes independentes.
          </Typography>
        </Box>

        <BusinessOutlinedIcon
          sx={{
            position: 'absolute',
            right: -20,
            bottom: -35,
            fontSize: 190,
            color: 'rgba(255,255,255,0.05)'
          }}
        />
      </Paper>

      {/* Empresas */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          color="#1E1E2F"
        >
          Empresas disponíveis
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {empresas.map((empresa) => (
          <Paper
            key={empresa.id}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #E4EAF2',
              backgroundColor: '#FFFFFF',
              transition: '0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(30,30,47,0.08)'
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 52,
                  height: 52,
                  backgroundColor: '#E8EEF9',
                  color: '#1E1E2F'
                }}
              >
                {empresa.icon}
              </Avatar>

              <Chip
                label={empresa.status}
                size="small"
                sx={{
                  backgroundColor: '#E5F5EB',
                  color: '#26834A',
                  fontWeight: 600
                }}
              />
            </Box>

            <Typography
              variant="h6"
              fontWeight={700}
              color="#1E1E2F"
            >
              {empresa.nome}
            </Typography>

            <Typography
              variant="caption"
              color="primary"
              fontWeight={600}
            >
              {empresa.segmento}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 2,
                mb: 3,
                lineHeight: 1.7,
                minHeight: 65
              }}
            >
              {empresa.descricao}
            </Typography>

            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() =>
                navigate(`/empresa/${empresa.id}`)
              }
              sx={{
                backgroundColor: '#1E1E2F',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                py: 1,
                '&:hover': {
                  backgroundColor: '#30304A'
                }
              }}
            >
              Acessar empresa
            </Button>
          </Paper>
        ))}
      </Box>

      {/* Rodapé */}
      <Box
        sx={{
          mt: 5,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <BusinessOutlinedIcon
          sx={{ fontSize: 17, color: '#8290A5' }}
        />

        <Typography variant="caption" color="text.secondary">
          Easy Manager · Plataforma de gerenciamento empresarial
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;
