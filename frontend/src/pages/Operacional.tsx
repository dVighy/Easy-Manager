
import { useMemo, useState } from 'react';

import {
  Avatar,
  Box,
  Chip,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import {
  CarFront,
  Clock3,
  LogIn,
  LogOut,
  ParkingSquare,
  Search,
  TrendingUp,
} from 'lucide-react';

interface Movimentacao {
  id: number;
  placa: string;
  veiculo: string;
  horario: string;
  tipo: 'Entrada' | 'Saída';
  status: 'Concluída' | 'Em andamento';
}

const movimentacoes: Movimentacao[] = [
  { id: 1, placa: 'ABC-1234', veiculo: 'Honda Civic', horario: '14:32', tipo: 'Entrada', status: 'Concluída' },
  { id: 2, placa: 'DEF-5678', veiculo: 'Toyota Corolla', horario: '14:18', tipo: 'Saída', status: 'Concluída' },
  { id: 3, placa: 'GHI-9012', veiculo: 'Chevrolet Onix', horario: '14:05', tipo: 'Entrada', status: 'Concluída' },
  { id: 4, placa: 'JKL-3456', veiculo: 'Volkswagen Polo', horario: '13:51', tipo: 'Entrada', status: 'Em andamento' },
  { id: 5, placa: 'MNO-7890', veiculo: 'Hyundai HB20', horario: '13:40', tipo: 'Saída', status: 'Concluída' },
  { id: 6, placa: 'PQR-1234', veiculo: 'Fiat Argo', horario: '13:22', tipo: 'Entrada', status: 'Concluída' },
  { id: 7, placa: 'STU-5678', veiculo: 'Jeep Renegade', horario: '13:10', tipo: 'Saída', status: 'Concluída' },
  { id: 8, placa: 'VWX-9012', veiculo: 'Ford Ka', horario: '12:55', tipo: 'Entrada', status: 'Concluída' },
];

const indicadores = [
  {
    titulo: 'Veículos atendidos',
    valor: '248',
    descricao: 'Movimentações do dia',
    icon: CarFront,
    cor: '#3977C5',
  },
  {
    titulo: 'Veículos estacionados',
    valor: '36',
    descricao: 'Ocupação atual',
    icon: ParkingSquare,
    cor: '#16865B',
  },
  {
    titulo: 'Entradas',
    valor: '142',
    descricao: 'Registros do dia',
    icon: LogIn,
    cor: '#3977C5',
  },
  {
    titulo: 'Saídas',
    valor: '106',
    descricao: 'Registros do dia',
    icon: LogOut,
    cor: '#D97706',
  },
];

export default function Operacional() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  const movimentacoesFiltradas = useMemo(() => {
    return movimentacoes.filter((item) => {
      const correspondeBusca =
        item.placa.toLowerCase().includes(busca.toLowerCase()) ||
        item.veiculo.toLowerCase().includes(busca.toLowerCase());

      const correspondeFiltro =
        filtro === 'Todos' || item.tipo === filtro;

      return correspondeBusca && correspondeFiltro;
    });
  }, [busca, filtro]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Cabeçalho */}
      <Box>
        <Typography variant="h4" fontWeight={700} color="#1E1E2F">
          Gestão Operacional
        </Typography>

        <Typography color="text.secondary" mt={0.5}>
          Acompanhe a movimentação e a ocupação do estacionamento.
        </Typography>
      </Box>

      <Chip
        label="Dados demonstrativos"
        size="small"
        sx={{
          alignSelf: 'flex-start',
          bgcolor: '#E8F1FC',
          color: '#3977C5',
          fontWeight: 600,
        }}
      />

      {/* Indicadores */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {indicadores.map((item) => {
          const Icon = item.icon;

          return (
            <Paper
              key={item.titulo}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid #E5EAF1',
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary" fontSize={13}>
                  {item.titulo}
                </Typography>

                <Box
                  sx={{
                    bgcolor: `${item.cor}15`,
                    color: item.cor,
                    p: 1,
                    borderRadius: 2,
                    display: 'flex',
                  }}
                >
                  <Icon size={21} />
                </Box>
              </Box>

              <Typography
                variant="h4"
                fontWeight={700}
                color="#1E1E2F"
                mt={1.5}
              >
                {item.valor}
              </Typography>

              <Typography color="text.secondary" fontSize={12} mt={0.5}>
                {item.descricao}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Ocupação */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid #E5EAF1',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography fontWeight={700} color="#1E1E2F">
              Ocupação do estacionamento
            </Typography>

            <Typography color="text.secondary" fontSize={13}>
              Distribuição das vagas disponíveis
            </Typography>
          </Box>

          <ParkingSquare color="#3977C5" size={25} />
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontSize={14} fontWeight={600}>
            36 de 60 vagas ocupadas
          </Typography>

          <Typography fontSize={14} fontWeight={700} color="#3977C5">
            60%
          </Typography>
        </Box>

        <Box
          sx={{
            height: 12,
            bgcolor: '#E8EDF4',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: '60%',
              height: '100%',
              bgcolor: '#3977C5',
              borderRadius: 10,
            }}
          />
        </Box>

        <Box display="flex" gap={3} mt={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={0.8}>
            <Box width={9} height={9} borderRadius="50%" bgcolor="#3977C5" />
            <Typography fontSize={12} color="text.secondary">
              36 ocupadas
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={0.8}>
            <Box width={9} height={9} borderRadius="50%" bgcolor="#E8EDF4" />
            <Typography fontSize={12} color="text.secondary">
              24 disponíveis
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Histórico */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #E5EAF1',
          overflow: 'hidden',
        }}
      >
        <Box
          p={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography fontWeight={700} color="#1E1E2F">
              Histórico de movimentações
            </Typography>

            <Typography color="text.secondary" fontSize={13}>
              Acompanhe os registros recentes de entrada e saída.
            </Typography>
          </Box>

          <Chip
            icon={<Clock3 size={15} />}
            label="Hoje"
            variant="outlined"
            size="small"
          />
        </Box>

        <Box
          px={3}
          pb={2}
          display="flex"
          gap={2}
          flexWrap="wrap"
        >
          <TextField
            size="small"
            placeholder="Buscar placa ou veículo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            sx={{ flex: 1, minWidth: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            size="small"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Entrada">Entradas</MenuItem>
            <MenuItem value="Saída">Saídas</MenuItem>
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFD' }}>
                <TableCell sx={{ fontWeight: 700 }}>Veículo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Placa</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Horário</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Movimentação</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {movimentacoesFiltradas.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        sx={{
                          bgcolor: '#E8F1FC',
                          color: '#3977C5',
                          width: 34,
                          height: 34,
                        }}
                      >
                        <CarFront size={18} />
                      </Avatar>

                      <Typography fontSize={13} fontWeight={600}>
                        {item.veiculo}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>{item.placa}</TableCell>

                  <TableCell>{item.horario}</TableCell>

                  <TableCell>
                    <Chip
                      label={item.tipo}
                      size="small"
                      color={item.tipo === 'Entrada' ? 'primary' : 'warning'}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={item.status}
                      size="small"
                      color={item.status === 'Concluída' ? 'success' : 'warning'}
                    />
                  </TableCell>
                </TableRow>
              ))}

              {movimentacoesFiltradas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Nenhuma movimentação encontrada.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box px={3} py={2} borderTop="1px solid #E5EAF1">
          <Typography color="text.secondary" fontSize={12}>
            Exibindo {movimentacoesFiltradas.length} de {movimentacoes.length} movimentações demonstrativas.
          </Typography>
        </Box>
      </Paper>

      {/* Observação */}
      <Box display="flex" alignItems="center" gap={1}>
        <TrendingUp size={17} color="#3977C5" />

        <Typography fontSize={12} color="text.secondary">
          Os indicadores e registros apresentados são ilustrativos.
        </Typography>
      </Box>
    </Box>
  );
}
