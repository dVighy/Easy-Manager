
import {
  Box,
  Typography,
  Paper,
  Chip
} from '@mui/material';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

import {
  MessageSquare,
  Smile,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  Clock,
  Users
} from 'lucide-react';

const sentimentos = [
  { name: 'Positivas', value: 174, color: '#319B72' },
  { name: 'Neutras', value: 32, color: '#E5B95C' },
  { name: 'Negativas', value: 42, color: '#D66B70' }
];

const evolucao = [
  { mes: 'Mai', positivas: 28, negativas: 12 },
  { mes: 'Jun', positivas: 35, negativas: 10 },
  { mes: 'Jul', positivas: 31, negativas: 14 },
  { mes: 'Ago', positivas: 42, negativas: 11 },
  { mes: 'Set', positivas: 38, negativas: 9 },
  { mes: 'Out', positivas: 48, negativas: 8 }
];

const avaliacoes = [
  {
    cliente: 'Cliente 001',
    comentario: 'Ótimo atendimento e facilidade para estacionar.',
    sentimento: 'Positivo',
    cor: '#319B72'
  },
  {
    cliente: 'Cliente 002',
    comentario: 'O tempo de espera para retirar o veículo foi muito longo.',
    sentimento: 'Negativo',
    cor: '#D66B70'
  },
  {
    cliente: 'Cliente 003',
    comentario: 'O estacionamento atende às minhas necessidades.',
    sentimento: 'Neutro',
    cor: '#C59637'
  },
  {
    cliente: 'Cliente 004',
    comentario: 'Ambiente organizado e funcionários atenciosos.',
    sentimento: 'Positivo',
    cor: '#319B72'
  }
];

const indicadores = [
  {
    titulo: 'Total de avaliações',
    valor: '248',
    descricao: '+12,5% em relação ao período anterior',
    icon: MessageSquare,
    cor: '#5578AD'
  },
  {
    titulo: 'Índice de satisfação',
    valor: '82%',
    descricao: 'Indicador demonstrativo',
    icon: Smile,
    cor: '#319B72'
  },
  {
    titulo: 'Avaliações positivas',
    valor: '174',
    descricao: '70% do total',
    icon: ThumbsUp,
    cor: '#319B72'
  },
  {
    titulo: 'Avaliações negativas',
    valor: '42',
    descricao: '17% do total',
    icon: ThumbsDown,
    cor: '#D66B70'
  }
];

function Painel() {
  return (
    <Box sx={{ width: '100%' }}>

      {/* Cabeçalho */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="#1E1E2F">
            Visão geral
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Acompanhe os indicadores e a satisfação dos clientes.
          </Typography>
        </Box>

        <Chip
          label="Dados demonstrativos"
          size="small"
          sx={{
            backgroundColor: '#E4ECF8',
            color: '#345B91',
            fontWeight: 600
          }}
        />
      </Box>

      {/* Indicadores */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 2,
          mb: 3
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
                border: '1px solid #E4EAF2'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {item.titulo}
                </Typography>

                <Icon size={21} color={item.cor} />
              </Box>

              <Typography
                variant="h4"
                fontWeight={700}
                color="#1E1E2F"
                sx={{ mt: 2 }}
              >
                {item.valor}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {item.descricao}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Gráficos */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1fr 1.5fr'
          },
          gap: 2,
          mb: 3
        }}
      >
        {/* Sentimentos */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid #E4EAF2'
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#1E1E2F">
            Análise de sentimentos
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Distribuição das avaliações recebidas
          </Typography>

          <Box sx={{ height: 260, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentos}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {sentimentos.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Evolução */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid #E4EAF2'
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#1E1E2F">
            Evolução das avaliações
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Comparativo mensal de sentimentos
          </Typography>

          <Box sx={{ height: 260, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucao}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />

                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />

                <YAxis tick={{ fontSize: 12 }} />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="positivas"
                  name="Positivas"
                  stroke="#319B72"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="negativas"
                  name="Negativas"
                  stroke="#D66B70"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>

      {/* Pontos de atenção */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid #E4EAF2',
          mb: 3
        }}
      >
        <Typography variant="h6" fontWeight={700} color="#1E1E2F">
          Principais pontos de atenção
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Temas ilustrativos identificados nos comentários
        </Typography>

        <Box sx={{ mt: 3, display: 'grid', gap: 2 }}>
          {[
            { nome: 'Tempo de espera', quantidade: 18, icon: Clock },
            { nome: 'Atendimento', quantidade: 12, icon: Users },
            { nome: 'Organização', quantidade: 7, icon: TrendingDown }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Box
                key={item.nome}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Icon size={19} color="#71829A" />

                  <Typography variant="body2" fontWeight={500}>
                    {item.nome}
                  </Typography>
                </Box>

                <Chip
                  label={`${item.quantidade} menções`}
                  size="small"
                  sx={{ backgroundColor: '#F0F3F8' }}
                />
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Últimas avaliações */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid #E4EAF2'
        }}
      >
        <Typography variant="h6" fontWeight={700} color="#1E1E2F">
          Últimas avaliações
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Comentários e classificação demonstrativa
        </Typography>

        <Box sx={{ mt: 2 }}>
          {avaliacoes.map((item, index) => (
            <Box
              key={index}
              sx={{
                py: 2,
                borderBottom:
                  index !== avaliacoes.length - 1
                    ? '1px solid #EDF0F5'
                    : 'none'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  mb: 1
                }}
              >
                <Typography fontWeight={600} variant="body2">
                  {item.cliente}
                </Typography>

                <Chip
                  label={item.sentimento}
                  size="small"
                  sx={{
                    color: item.cor,
                    backgroundColor: `${item.cor}18`,
                    fontWeight: 600
                  }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary">
                {item.comentario}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="caption" color="text.secondary">
          Easy Manager · EstacionaFácil
        </Typography>
      </Box>

    </Box>
  );
}

export default Painel;
