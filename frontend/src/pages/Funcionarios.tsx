
import { useMemo, useState } from 'react';

import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import {
  BriefcaseBusiness,
  Clock,
  Search,
  Star,
  UserCheck,
  Users,
  X,
} from 'lucide-react';

interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  status: 'Em atividade' | 'Em intervalo' | 'Inativo';
  avaliacao: number;
  inicial: string;
  email: string;
  telefone: string;
}

const funcionarios: Funcionario[] = [
  {
    id: 1,
    nome: 'Carlos Oliveira',
    cargo: 'Operador de estacionamento',
    departamento: 'Operacional',
    status: 'Em atividade',
    avaliacao: 4.8,
    inicial: 'C',
    email: 'carlos@estacionafacil.com',
    telefone: '(12) 99999-1001',
  },
  {
    id: 2,
    nome: 'Mariana Santos',
    cargo: 'Atendente',
    departamento: 'Atendimento',
    status: 'Em atividade',
    avaliacao: 4.9,
    inicial: 'M',
    email: 'mariana@estacionafacil.com',
    telefone: '(12) 99999-1002',
  },
  {
    id: 3,
    nome: 'Lucas Ferreira',
    cargo: 'Operador de estacionamento',
    departamento: 'Operacional',
    status: 'Em intervalo',
    avaliacao: 4.5,
    inicial: 'L',
    email: 'lucas@estacionafacil.com',
    telefone: '(12) 99999-1003',
  },
  {
    id: 4,
    nome: 'Ana Carolina Lima',
    cargo: 'Supervisora',
    departamento: 'Gestão',
    status: 'Em atividade',
    avaliacao: 4.9,
    inicial: 'A',
    email: 'ana@estacionafacil.com',
    telefone: '(12) 99999-1004',
  },
  {
    id: 5,
    nome: 'Pedro Almeida',
    cargo: 'Atendente',
    departamento: 'Atendimento',
    status: 'Em atividade',
    avaliacao: 4.4,
    inicial: 'P',
    email: 'pedro@estacionafacil.com',
    telefone: '(12) 99999-1005',
  },
  {
    id: 6,
    nome: 'Juliana Costa',
    cargo: 'Operadora de estacionamento',
    departamento: 'Operacional',
    status: 'Em intervalo',
    avaliacao: 4.7,
    inicial: 'J',
    email: 'juliana@estacionafacil.com',
    telefone: '(12) 99999-1006',
  },
  {
    id: 7,
    nome: 'Rafael Mendes',
    cargo: 'Auxiliar administrativo',
    departamento: 'Administrativo',
    status: 'Em atividade',
    avaliacao: 4.3,
    inicial: 'R',
    email: 'rafael@estacionafacil.com',
    telefone: '(12) 99999-1007',
  },
  {
    id: 8,
    nome: 'Beatriz Souza',
    cargo: 'Atendente',
    departamento: 'Atendimento',
    status: 'Em atividade',
    avaliacao: 4.8,
    inicial: 'B',
    email: 'beatriz@estacionafacil.com',
    telefone: '(12) 99999-1008',
  },
];

const indicadores = [
  {
    titulo: 'Total de funcionários',
    valor: '12',
    descricao: 'Equipe cadastrada',
    icon: Users,
    cor: '#3977C5',
  },
  {
    titulo: 'Em atividade',
    valor: '10',
    descricao: 'Funcionários ativos',
    icon: UserCheck,
    cor: '#16865B',
  },
  {
    titulo: 'Em intervalo',
    valor: '2',
    descricao: 'Funcionários em pausa',
    icon: Clock,
    cor: '#D97706',
  },
  {
    titulo: 'Avaliação média',
    valor: '4,6/5',
    descricao: 'Indicador demonstrativo',
    icon: Star,
    cor: '#8057B7',
  },
];

export default function Funcionarios() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');
  const [selecionado, setSelecionado] = useState<Funcionario | null>(null);

  const funcionariosFiltrados = useMemo(() => {
    return funcionarios.filter((item) => {
      const correspondeBusca =
        item.nome.toLowerCase().includes(busca.toLowerCase()) ||
        item.cargo.toLowerCase().includes(busca.toLowerCase()) ||
        item.departamento.toLowerCase().includes(busca.toLowerCase());

      const correspondeFiltro =
        filtro === 'Todos' || item.status === filtro;

      return correspondeBusca && correspondeFiltro;
    });
  }, [busca, filtro]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Cabeçalho */}
      <Box>
        <Typography variant="h4" fontWeight={700} color="#1E1E2F">
          Gestão de Funcionários
        </Typography>

        <Typography color="text.secondary" mt={0.5}>
          Acompanhe a equipe, suas funções e indicadores de desempenho.
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

      {/* Listagem */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #E5EAF1',
          overflow: 'hidden',
        }}
      >
        <Box p={3}>
          <Typography fontWeight={700} color="#1E1E2F">
            Equipe de funcionários
          </Typography>

          <Typography color="text.secondary" fontSize={13}>
            Consulte os integrantes e suas informações.
          </Typography>
        </Box>

        <Box px={3} pb={2} display="flex" gap={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Buscar funcionário..."
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
            sx={{ width: 170 }}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Em atividade">Em atividade</MenuItem>
            <MenuItem value="Em intervalo">Em intervalo</MenuItem>
            <MenuItem value="Inativo">Inativo</MenuItem>
          </TextField>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: 2,
            p: 3,
          }}
        >
          {funcionariosFiltrados.map((item) => (
            <Paper
              key={item.id}
              elevation={0}
              onClick={() => setSelecionado(item)}
              sx={{
                p: 2,
                border: '1px solid #E5EAF1',
                borderRadius: 3,
                cursor: 'pointer',
                transition: '0.2s',
                '&:hover': {
                  borderColor: '#3977C5',
                  bgcolor: '#F8FAFD',
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: '#E8F1FC',
                    color: '#3977C5',
                    width: 48,
                    height: 48,
                    fontWeight: 700,
                  }}
                >
                  {item.inicial}
                </Avatar>

                <Box flex={1} minWidth={0}>
                  <Typography fontWeight={700} color="#1E1E2F">
                    {item.nome}
                  </Typography>

                  <Typography color="text.secondary" fontSize={12}>
                    {item.cargo}
                  </Typography>
                </Box>

                <Chip
                  label={item.status}
                  size="small"
                  color={
                    item.status === 'Em atividade'
                      ? 'success'
                      : item.status === 'Em intervalo'
                        ? 'warning'
                        : 'default'
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={0.7}>
                  <BriefcaseBusiness size={15} color="#64748B" />

                  <Typography color="text.secondary" fontSize={12}>
                    {item.departamento}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={0.5}>
                  <Star size={15} color="#D97706" fill="#D97706" />

                  <Typography fontWeight={700} fontSize={13}>
                    {item.avaliacao.toFixed(1)}
                  </Typography>
                </Box>
              </Box>

              <Typography
                fontSize={12}
                color="#3977C5"
                fontWeight={600}
                mt={2}
              >
                Ver detalhes →
              </Typography>
            </Paper>
          ))}

          {funcionariosFiltrados.length === 0 && (
            <Box gridColumn="1 / -1" textAlign="center" py={4}>
              <Typography color="text.secondary">
                Nenhum funcionário encontrado.
              </Typography>
            </Box>
          )}
        </Box>

        <Box px={3} py={2} borderTop="1px solid #E5EAF1">
          <Typography color="text.secondary" fontSize={12}>
            Exibindo {funcionariosFiltrados.length} de {funcionarios.length} funcionários demonstrativos.
          </Typography>
        </Box>
      </Paper>

      {/* Detalhes do funcionário */}
      <Dialog
        open={Boolean(selecionado)}
        onClose={() => setSelecionado(null)}
        fullWidth
        maxWidth="sm"
      >
        {selecionado && (
          <>
            <DialogTitle
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              Informações do funcionário

              <Box
                component="button"
                onClick={() => setSelecionado(null)}
                sx={{
                  border: 0,
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  color: '#64748B',
                }}
              >
                <X size={20} />
              </Box>
            </DialogTitle>

            <DialogContent>
              <Box display="flex" alignItems="center" gap={2} mb={3} mt={1}>
                <Avatar
                  sx={{
                    width: 58,
                    height: 58,
                    bgcolor: '#E8F1FC',
                    color: '#3977C5',
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  {selecionado.inicial}
                </Avatar>

                <Box>
                  <Typography fontWeight={700} fontSize={18}>
                    {selecionado.nome}
                  </Typography>

                  <Typography color="text.secondary" fontSize={13}>
                    {selecionado.cargo}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography color="text.secondary" fontSize={12}>
                    Departamento
                  </Typography>
                  <Typography fontWeight={600}>
                    {selecionado.departamento}
                  </Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary" fontSize={12}>
                    Situação atual
                  </Typography>
                  <Chip
                    label={selecionado.status}
                    size="small"
                    color={selecionado.status === 'Em atividade' ? 'success' : 'warning'}
                  />
                </Box>

                <Box>
                  <Typography color="text.secondary" fontSize={12}>
                    E-mail
                  </Typography>
                  <Typography fontWeight={600}>
                    {selecionado.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary" fontSize={12}>
                    Telefone
                  </Typography>
                  <Typography fontWeight={600}>
                    {selecionado.telefone}
                  </Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary" fontSize={12}>
                    Indicador de desempenho ilustrativo
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Star size={18} color="#D97706" fill="#D97706" />
                    <Typography fontWeight={700}>
                      {selecionado.avaliacao.toFixed(1)} / 5
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                mt={3}
                p={2}
                bgcolor="#F1F7FF"
                borderRadius={2}
              >
                <Typography fontSize={12} color="text.secondary">
                  As informações e os indicadores desta página são demonstrativos. Não há integração com registros reais de funcionários ou avaliação automatizada de desempenho nesta versão.
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
