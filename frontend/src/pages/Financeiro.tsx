
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
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  ChartNoAxesCombined,
  Receipt,
  Search,
  Wallet,
} from 'lucide-react';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Transacao {
  id: number;
  descricao: string;
  categoria: string;
  data: string;
  valor: number;
  tipo: 'Receita' | 'Despesa';
}

const transacoes: Transacao[] = [
  { id: 1, descricao: 'Pagamento mensalista', categoria: 'Estacionamento', data: '03/11/2026', valor: 450, tipo: 'Receita' },
  { id: 2, descricao: 'Conta de energia', categoria: 'Infraestrutura', data: '03/11/2026', valor: 680, tipo: 'Despesa' },
  { id: 3, descricao: 'Pagamento avulso', categoria: 'Estacionamento', data: '02/11/2026', valor: 35, tipo: 'Receita' },
  { id: 4, descricao: 'Manutenção de equipamentos', categoria: 'Manutenção', data: '02/11/2026', valor: 320, tipo: 'Despesa' },
  { id: 5, descricao: 'Plano mensalista', categoria: 'Estacionamento', data: '01/11/2026', valor: 450, tipo: 'Receita' },
  { id: 6, descricao: 'Materiais de limpeza', categoria: 'Operacional', data: '01/11/2026', valor: 150, tipo: 'Despesa' },
  { id: 7, descricao: 'Pagamento avulso', categoria: 'Estacionamento', data: '31/10/2026', valor: 28, tipo: 'Receita' },
  { id: 8, descricao: 'Serviços terceirizados', categoria: 'Serviços', data: '30/10/2026', valor: 900, tipo: 'Despesa' },
];

const dadosMensais = [
  { mes: 'Jun', receitas: 12500, despesas: 5100 },
  { mes: 'Jul', receitas: 14200, despesas: 5600 },
  { mes: 'Ago', receitas: 13800, despesas: 4900 },
  { mes: 'Set', receitas: 15900, despesas: 5800 },
  { mes: 'Out', receitas: 17100, despesas: 6100 },
  { mes: 'Nov', receitas: 18450, despesas: 6200 },
];

const formatarMoeda = (valor: number) =>
  valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const indicadores = [
  {
    titulo: 'Receita total',
    valor: 'R$ 18.450,00',
    descricao: 'Recebimentos do período',
    icon: Wallet,
    cor: '#16865B',
  },
  {
    titulo: 'Despesas',
    valor: 'R$ 6.200,00',
    descricao: 'Custos do período',
    icon: Receipt,
    cor: '#D97706',
  },
  {
    titulo: 'Lucro estimado',
    valor: 'R$ 12.250,00',
    descricao: 'Receita menos despesas',
    icon: ChartNoAxesCombined,
    cor: '#3977C5',
  },
  {
    titulo: 'Ticket médio',
    valor: 'R$ 74,40',
    descricao: 'Por veículo atendido',
    icon: CalendarDays,
    cor: '#8057B7',
  },
];

export default function Financeiro() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter((item) => {
      const correspondeBusca =
        item.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        item.categoria.toLowerCase().includes(busca.toLowerCase());

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
          Gestão Financeira
        </Typography>

        <Typography color="text.secondary" mt={0.5}>
          Acompanhe receitas, despesas e resultados financeiros.
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
                variant="h5"
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

      {/* Gráfico */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid #E5EAF1',
        }}
      >
        <Box mb={3}>
          <Typography fontWeight={700} color="#1E1E2F">
            Receitas e despesas
          </Typography>

          <Typography color="text.secondary" fontSize={13}>
            Comparativo financeiro dos últimos meses
          </Typography>
        </Box>

        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosMensais}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EDF4" />

              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />

              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(valor) => `R$${valor / 1000}k`}
              />

              <Tooltip
                formatter={(valor) => formatarMoeda(Number(valor))}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="receitas"
                name="Receitas"
                stroke="#16865B"
                strokeWidth={3}
                dot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="despesas"
                name="Despesas"
                stroke="#D97706"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
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
              Histórico financeiro
            </Typography>

            <Typography color="text.secondary" fontSize={13}>
              Consulte as movimentações financeiras registradas.
            </Typography>
          </Box>

          <Chip
            label="Movimentações recentes"
            size="small"
            variant="outlined"
          />
        </Box>

        <Box px={3} pb={2} display="flex" gap={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Buscar movimentação..."
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
            <MenuItem value="Receita">Receitas</MenuItem>
            <MenuItem value="Despesa">Despesas</MenuItem>
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFD' }}>
                <TableCell sx={{ fontWeight: 700 }}>Descrição</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Categoria</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Data</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Valor</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {transacoesFiltradas.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        sx={{
                          bgcolor: item.tipo === 'Receita' ? '#E5F5ED' : '#FFF3E0',
                          color: item.tipo === 'Receita' ? '#16865B' : '#D97706',
                          width: 34,
                          height: 34,
                        }}
                      >
                        {item.tipo === 'Receita' ? (
                          <ArrowUpCircle size={19} />
                        ) : (
                          <ArrowDownCircle size={19} />
                        )}
                      </Avatar>

                      <Typography fontSize={13} fontWeight={600}>
                        {item.descricao}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>{item.categoria}</TableCell>

                  <TableCell>{item.data}</TableCell>

                  <TableCell>
                    <Chip
                      label={item.tipo}
                      size="small"
                      color={item.tipo === 'Receita' ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography
                      fontWeight={600}
                      color={item.tipo === 'Receita' ? '#16865B' : '#D97706'}
                    >
                      {item.tipo === 'Receita' ? '+' : '-'}
                      {formatarMoeda(item.valor)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}

              {transacoesFiltradas.length === 0 && (
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
            Exibindo {transacoesFiltradas.length} de {transacoes.length} movimentações demonstrativas.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
