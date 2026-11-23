
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Typography,
  Divider,
} from '@mui/material';

import {
  Activity,
  ArrowUpCircle,
  BarChart3,
  CarFront,
  MessageSquare,
  Star,
  Users,
  Wallet,
} from 'lucide-react';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface AvaliacaoAPI {
  id: number;
  comentario: string | null;
  nota: number;
  sentimento: string | null;
  data: string | null;
  cliente?: {
    nome?: string;
  } | null;
}

interface FuncionarioAPI {
  id: number;
  nome?: string;
  ativo: boolean;
}

const dadosFinanceiros = [
  { mes: 'Jun', receitas: 12500, despesas: 5100 },
  { mes: 'Jul', receitas: 14200, despesas: 5600 },
  { mes: 'Ago', receitas: 13800, despesas: 4900 },
  { mes: 'Set', receitas: 15900, despesas: 5800 },
  { mes: 'Out', receitas: 17100, despesas: 6100 },
  { mes: 'Nov', receitas: 18450, despesas: 6200 },
];

const dadosOperacionais = [
  { mes: 'Jun', entradas: 180, saidas: 165 },
  { mes: 'Jul', entradas: 195, saidas: 180 },
  { mes: 'Ago', entradas: 205, saidas: 190 },
  { mes: 'Set', entradas: 220, saidas: 202 },
  { mes: 'Out', entradas: 235, saidas: 210 },
  { mes: 'Nov', entradas: 142, saidas: 106 },
];

const formatarMoeda = (valor: number) =>
  valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const formatarEixo = (valor: number) => `R$${valor / 1000}k`;

const normalizarSentimento = (avaliacao: AvaliacaoAPI) => {
  const sentimento = avaliacao.sentimento?.trim().toLowerCase();

  if (sentimento === 'positivo') return 'Positivas';
  if (sentimento === 'neutro') return 'Neutras';
  if (sentimento === 'negativo') return 'Negativas';

  if (avaliacao.nota >= 4) return 'Positivas';
  if (avaliacao.nota === 3) return 'Neutras';

  return 'Negativas';
};

export default function Relatorios() {
  const { empresaId } = useParams();

  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoAPI[]>([]);
  const [funcionarios, setFuncionarios] = useState<FuncionarioAPI[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erroAvaliacoes, setErroAvaliacoes] = useState('');
  const [erroFuncionarios, setErroFuncionarios] = useState('');

  useEffect(() => {
    if (!empresaId) {
      setErroAvaliacoes('Empresa não identificada na rota.');
      setErroFuncionarios('Empresa não identificada na rota.');
      setCarregando(false);
      return;
    }

    const buscarDados = async () => {
      setCarregando(true);
      setErroAvaliacoes('');
      setErroFuncionarios('');

      const [resultadoAvaliacoes, resultadoFuncionarios] =
        await Promise.allSettled([
          fetch(
            `http://localhost:8080/api/avaliacoes/empresa/${empresaId}`
          ),
          fetch(
            `http://localhost:8080/api/funcionarios/empresa/${empresaId}`
          ),
        ]);

      if (resultadoAvaliacoes.status === 'fulfilled') {
        try {
          const resposta = resultadoAvaliacoes.value;

          if (!resposta.ok) {
            throw new Error('Não foi possível carregar as avaliações.');
          }

          const dados: AvaliacaoAPI[] = await resposta.json();
          setAvaliacoes(dados);
        } catch (error) {
          setErroAvaliacoes(
            error instanceof Error
              ? error.message
              : 'Erro ao carregar avaliações.'
          );
        }
      } else {
        setErroAvaliacoes('Erro de conexão ao carregar avaliações.');
      }

      if (resultadoFuncionarios.status === 'fulfilled') {
        try {
          const resposta = resultadoFuncionarios.value;

          if (!resposta.ok) {
            throw new Error('Não foi possível carregar os funcionários.');
          }

          const dados: FuncionarioAPI[] = await resposta.json();
          setFuncionarios(dados);
        } catch (error) {
          setErroFuncionarios(
            error instanceof Error
              ? error.message
              : 'Erro ao carregar funcionários.'
          );
        }
      } else {
        setErroFuncionarios('Erro de conexão ao carregar funcionários.');
      }

      setCarregando(false);
    };

    buscarDados();
  }, [empresaId]);

  const dadosAvaliacoes = useMemo(() => {
    const quantidade = {
      Positivas: 0,
      Neutras: 0,
      Negativas: 0,
    };

    avaliacoes.forEach((avaliacao) => {
      quantidade[normalizarSentimento(avaliacao)]++;
    });

    return [
      {
        nome: 'Positivas',
        quantidade: quantidade.Positivas,
        cor: '#16865B',
      },
      {
        nome: 'Neutras',
        quantidade: quantidade.Neutras,
        cor: '#D99A26',
      },
      {
        nome: 'Negativas',
        quantidade: quantidade.Negativas,
        cor: '#D65B5B',
      },
    ];
  }, [avaliacoes]);

  const totalAvaliacoes = avaliacoes.length;

  const funcionariosAtivos = funcionarios.filter(
    (funcionario) => funcionario.ativo
  ).length;

  const funcionariosInativos = funcionarios.filter(
    (funcionario) => !funcionario.ativo
  ).length;

  const indicadores = [
    {
      titulo: 'Receita do período',
      valor: 'R$ 18.450,00',
      descricao: 'Dado demonstrativo',
      icon: Wallet,
      cor: '#16865B',
      demonstrativo: true,
    },
    {
      titulo: 'Movimentações',
      valor: '248',
      descricao: 'Entradas e saídas do dia',
      icon: CarFront,
      cor: '#3977C5',
      demonstrativo: true,
    },
    {
      titulo: 'Avaliações recebidas',
      valor: totalAvaliacoes.toString(),
      descricao: 'Dados reais da empresa',
      icon: MessageSquare,
      cor: '#8057B7',
      demonstrativo: false,
    },
    {
      titulo: 'Funcionários cadastrados',
      valor: funcionarios.length.toString(),
      descricao: 'Dados reais da empresa',
      icon: Users,
      cor: '#D97706',
      demonstrativo: false,
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Cabeçalho */}
      <Box>
        <Typography variant="h4" fontWeight={700} color="#1E1E2F">
          Relatórios
        </Typography>

        <Typography color="text.secondary" mt={0.5}>
          Visualize os resultados e indicadores gerais da empresa.
        </Typography>
      </Box>

      <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
        <Chip
          label="Dados reais e demonstrativos"
          size="small"
          sx={{
            bgcolor: '#E8F1FC',
            color: '#3977C5',
            fontWeight: 600,
          }}
        />

        <Chip
          label="Visão dos indicadores disponíveis"
          size="small"
          variant="outlined"
        />
      </Box>

      {erroAvaliacoes && (
        <Alert severity="error">{erroAvaliacoes}</Alert>
      )}

      {erroFuncionarios && (
        <Alert severity="error">{erroFuncionarios}</Alert>
      )}

      {carregando && (
        <Box display="flex" alignItems="center" gap={1}>
          <CircularProgress size={18} />
          <Typography color="text.secondary" fontSize={13}>
            Atualizando os dados dos relatórios...
          </Typography>
        </Box>
      )}

      {/* Resumo */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: '#1E1E2F',
          color: '#FFFFFF',
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <BarChart3 size={21} color="#A9C9F5" />

          <Typography fontWeight={600} fontSize={14} color="#A9C9F5">
            RESUMO GERENCIAL
          </Typography>
        </Box>

        <Typography variant="h5" fontWeight={700} mb={1}>
          Visão geral da empresa
        </Typography>

        <Typography
          fontSize={13}
          sx={{ color: '#D0D3DF', maxWidth: 700, lineHeight: 1.8 }}
        >
          Acompanhe os indicadores financeiros, operacionais e de
          satisfação dos clientes. Os dados de avaliações e funcionários
          são consultados diretamente no sistema.
        </Typography>
      </Paper>

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
                {carregando && !item.demonstrativo ? '...' : item.valor}
              </Typography>

              <Typography color="text.secondary" fontSize={12} mt={0.5}>
                {item.descricao}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Indicadores financeiros demonstrativos */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid #E5EAF1',
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Wallet size={20} color="#3977C5" />

          <Typography fontWeight={700} color="#1E1E2F">
            Desempenho financeiro
          </Typography>

          <Chip label="Demonstrativo" size="small" />
        </Box>

        <Typography color="text.secondary" fontSize={13} mb={3}>
          Comparativo ilustrativo de receitas e despesas.
        </Typography>

        <Box sx={{ width: '100%', height: 290 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosFinanceiros}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E8EDF4"
              />

              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />

              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={formatarEixo}
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

        <Box display="flex" gap={3} mt={2} flexWrap="wrap">
          <Box>
            <Typography fontSize={12} color="text.secondary">
              Receita demonstrativa
            </Typography>
            <Typography fontWeight={700} color="#16865B">
              R$ 18.450,00
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              Despesas demonstrativas
            </Typography>
            <Typography fontWeight={700} color="#D97706">
              R$ 6.200,00
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={12} color="text.secondary">
              Resultado demonstrativo
            </Typography>
            <Typography fontWeight={700} color="#3977C5">
              R$ 12.250,00
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Operacional e avaliações */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1.4fr 1fr',
          },
          gap: 2,
        }}
      >
        {/* Operacional */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid #E5EAF1',
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Activity size={20} color="#3977C5" />

            <Typography fontWeight={700} color="#1E1E2F">
              Movimentação operacional
            </Typography>

            <Chip label="Demonstrativo" size="small" />
          </Box>

          <Typography color="text.secondary" fontSize={13} mb={3}>
            Comparativo ilustrativo de entradas e saídas.
          </Typography>

          <Box sx={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosOperacionais}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E8EDF4"
                />

                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />

                <YAxis tick={{ fontSize: 11 }} />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="entradas"
                  name="Entradas"
                  stroke="#3977C5"
                  strokeWidth={2.5}
                />

                <Line
                  type="monotone"
                  dataKey="saidas"
                  name="Saídas"
                  stroke="#D97706"
                  strokeWidth={2.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          <Box display="flex" gap={3} mt={2}>
            <Box>
              <Typography color="text.secondary" fontSize={12}>
                Entradas demonstrativas
              </Typography>
              <Typography fontWeight={700} fontSize={20}>
                142
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary" fontSize={12}>
                Saídas demonstrativas
              </Typography>
              <Typography fontWeight={700} fontSize={20}>
                106
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Avaliações reais */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid #E5EAF1',
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Star size={20} color="#D99A26" />

            <Typography fontWeight={700} color="#1E1E2F">
              Satisfação dos clientes
            </Typography>
          </Box>

          <Typography color="text.secondary" fontSize={13}>
            Distribuição das avaliações recebidas.
          </Typography>

          {totalAvaliacoes > 0 ? (
            <>
              <Box sx={{ width: '100%', height: 220, mt: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosAvaliacoes}
                      dataKey="quantidade"
                      nameKey="nome"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {dadosAvaliacoes.map((item) => (
                        <Cell key={item.nome} fill={item.cor} />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Box display="flex" flexDirection="column" gap={1.5}>
                {dadosAvaliacoes.map((item) => (
                  <Box
                    key={item.nome}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        width={10}
                        height={10}
                        borderRadius="50%"
                        bgcolor={item.cor}
                      />

                      <Typography fontSize={13} color="text.secondary">
                        {item.nome}
                      </Typography>
                    </Box>

                    <Typography fontWeight={700} fontSize={13}>
                      {item.quantidade}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography fontSize={13} color="text.secondary">
                {dadosAvaliacoes[0].quantidade} avaliações positivas de{' '}
                {totalAvaliacoes} registros.
              </Typography>
            </>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              minHeight={220}
            >
              <Typography color="text.secondary" fontSize={13}>
                {carregando
                  ? 'Carregando avaliações...'
                  : 'Nenhuma avaliação cadastrada para esta empresa.'}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Resumo real da equipe */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid #E5EAF1',
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Users size={20} color="#3977C5" />

          <Typography fontWeight={700} color="#1E1E2F">
            Resumo da equipe
          </Typography>
        </Box>

        <Typography color="text.secondary" fontSize={13} mb={2.5}>
          Quantidade de funcionários cadastrados e seus status.
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(3, 1fr)',
          }}
          gap={2}
        >
          <Box>
            <Typography color="text.secondary" fontSize={12}>
              Total de funcionários
            </Typography>
            <Typography fontSize={24} fontWeight={700}>
              {carregando ? '...' : funcionarios.length}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" fontSize={12}>
              Funcionários ativos
            </Typography>
            <Typography fontSize={24} fontWeight={700} color="#16865B">
              {carregando ? '...' : funcionariosAtivos}
            </Typography>
          </Box>

          <Box>
            <Typography color="text.secondary" fontSize={12}>
              Funcionários inativos
            </Typography>
            <Typography fontSize={24} fontWeight={700} color="#D97706">
              {carregando ? '...' : funcionariosInativos}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Observação */}
      <Box display="flex" alignItems="center" gap={1}>
        <ArrowUpCircle size={17} color="#3977C5" />

        <Typography color="text.secondary" fontSize={12}>
          Avaliações e equipe são dados reais do sistema. Os indicadores
          financeiros e operacionais permanecem demonstrativos.
        </Typography>
      </Box>
    </Box>
  );
}
