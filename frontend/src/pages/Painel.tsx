
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Alert,
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
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
  CartesianGrid,
} from 'recharts';

import {
  MessageSquare,
  Smile,
  ThumbsUp,
  ThumbsDown,
  TrendingDown,
  Clock,
  Users,
} from 'lucide-react';

type Sentimento = 'Positivo' | 'Neutro' | 'Negativo';

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

interface Avaliacao {
  id: number;
  cliente: string;
  comentario: string;
  sentimento: Sentimento;
  nota: number;
  data: string;
}

const cores = {
  Positivo: '#319B72',
  Neutro: '#E5B95C',
  Negativo: '#D66B70',
};

function normalizarSentimento(valor: string | null, nota: number): Sentimento {
  if (valor === 'Positivo' || valor === 'Neutro' || valor === 'Negativo') {
    return valor;
  }

  if (nota >= 4) return 'Positivo';
  if (nota === 3) return 'Neutro';
  if (nota >= 1) return 'Negativo';

  return 'Neutro';
}

function Painel() {
  const { empresaId } = useParams();

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const buscarAvaliacoes = async () => {
      if (!empresaId) {
        setErro('Empresa não identificada.');
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro('');

        const resposta = await fetch(
          `http://localhost:8080/api/avaliacoes/empresa/${empresaId}`
        );

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar as avaliações.');
        }

        const dados: AvaliacaoAPI[] = await resposta.json();

        const formatadas: Avaliacao[] = dados.map((item) => ({
          id: item.id,
          cliente: item.cliente?.nome ?? 'Cliente não identificado',
          comentario: item.comentario ?? '',
          sentimento: normalizarSentimento(item.sentimento, item.nota),
          nota: item.nota,
          data: item.data ?? '',
        }));

        setAvaliacoes(formatadas);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar avaliações.'
        );
      } finally {
        setCarregando(false);
      }
    };

    buscarAvaliacoes();
  }, [empresaId]);

  const total = avaliacoes.length;

  const contagem = useMemo(() => ({
    positivas: avaliacoes.filter((a) => a.sentimento === 'Positivo').length,
    neutras: avaliacoes.filter((a) => a.sentimento === 'Neutro').length,
    negativas: avaliacoes.filter((a) => a.sentimento === 'Negativo').length,
  }), [avaliacoes]);

  const percentualPositivo = total
    ? Math.round((contagem.positivas / total) * 100)
    : 0;

  const sentimentos = [
    { name: 'Positivas', value: contagem.positivas, color: cores.Positivo },
    { name: 'Neutras', value: contagem.neutras, color: cores.Neutro },
    { name: 'Negativas', value: contagem.negativas, color: cores.Negativo },
  ];

  const evolucao = useMemo(() => {
    const meses = new Map<string, { positivas: number; negativas: number; ordem: number }>();

    avaliacoes.forEach((item) => {
      if (!item.data) return;

      const data = new Date(item.data);
      if (Number.isNaN(data.getTime())) return;

      const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      const mes = data.toLocaleDateString('pt-BR', { month: 'short' });

      if (!meses.has(chave)) {
        meses.set(chave, { positivas: 0, negativas: 0, ordem: data.getTime() });
      }

      const registro = meses.get(chave)!;

      if (item.sentimento === 'Positivo') registro.positivas++;
      if (item.sentimento === 'Negativo') registro.negativas++;
    });

    return Array.from(meses.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([chave, valores]) => ({
        mes: new Date(valores.ordem).toLocaleDateString('pt-BR', { month: 'short' }),
        positivas: valores.positivas,
        negativas: valores.negativas,
      }));
  }, [avaliacoes]);

  const ultimasAvaliacoes = useMemo(() => {
    return [...avaliacoes]
      .sort((a, b) => {
        return new Date(b.data || 0).getTime() - new Date(a.data || 0).getTime();
      })
      .slice(0, 4);
  }, [avaliacoes]);

  const indicadores = [
    {
      titulo: 'Total de avaliações',
      valor: total.toString(),
      descricao: 'Avaliações cadastradas',
      icon: MessageSquare,
      cor: '#5578AD',
    },
    {
      titulo: 'Índice de satisfação',
      valor: `${percentualPositivo}%`,
      descricao: 'Avaliações positivas',
      icon: Smile,
      cor: '#319B72',
    },
    {
      titulo: 'Avaliações positivas',
      valor: contagem.positivas.toString(),
      descricao: total ? `${Math.round((contagem.positivas / total) * 100)}% do total` : 'Sem avaliações',
      icon: ThumbsUp,
      cor: '#319B72',
    },
    {
      titulo: 'Avaliações negativas',
      valor: contagem.negativas.toString(),
      descricao: total ? `${Math.round((contagem.negativas / total) * 100)}% do total` : 'Sem avaliações',
      icon: ThumbsDown,
      cor: '#D66B70',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
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
          label="Dados do sistema"
          size="small"
          sx={{
            backgroundColor: '#E4ECF8',
            color: '#345B91',
            fontWeight: 600,
          }}
        />
      </Box>

      {erro && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {erro}
        </Alert>
      )}

      {carregando ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 2,
              mb: 3,
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
                    border: '1px solid #E4EAF2',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
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

                  <Typography variant="caption" color="text.secondary">
                    {item.descricao}
                  </Typography>
                </Paper>
              );
            })}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg: '1fr 1.5fr',
              },
              gap: 2,
              mb: 3,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #E4EAF2',
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#1E1E2F">
                Análise de sentimentos
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Distribuição das avaliações recebidas
              </Typography>

              <Box sx={{ height: 260, mt: 2 }}>
                {total > 0 ? (
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
                ) : (
                  <Box display="flex" height="100%" alignItems="center" justifyContent="center">
                    <Typography color="text.secondary">
                      Nenhuma avaliação cadastrada.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #E4EAF2',
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#1E1E2F">
                Evolução das avaliações
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Comparativo mensal de sentimentos
              </Typography>

              <Box sx={{ height: 260, mt: 2 }}>
                {evolucao.length > 0 ? (
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
                ) : (
                  <Box display="flex" height="100%" alignItems="center" justifyContent="center">
                    <Typography color="text.secondary">
                      Não há dados suficientes para exibir a evolução.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #E4EAF2',
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#1E1E2F">
              Principais pontos de atenção
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Temas ainda não disponíveis na análise dos comentários
            </Typography>

            <Box sx={{ mt: 3, display: 'grid', gap: 2 }}>
              {[
                { nome: 'Tempo de espera', icon: Clock },
                { nome: 'Atendimento', icon: Users },
                { nome: 'Organização', icon: TrendingDown },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <Box
                    key={item.nome}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Icon size={19} color="#71829A" />
                      <Typography variant="body2" fontWeight={500}>
                        {item.nome}
                      </Typography>
                    </Box>

                    <Chip
                      label="Análise pendente"
                      size="small"
                      sx={{ backgroundColor: '#F0F3F8' }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #E4EAF2',
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#1E1E2F">
              Últimas avaliações
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Comentários e classificação registrados
            </Typography>

            <Box sx={{ mt: 2 }}>
              {ultimasAvaliacoes.length > 0 ? (
                ultimasAvaliacoes.map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      py: 2,
                      borderBottom:
                        index !== ultimasAvaliacoes.length - 1
                          ? '1px solid #EDF0F5'
                          : 'none',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Typography fontWeight={600} variant="body2">
                        {item.cliente}
                      </Typography>

                      <Chip
                        label={item.sentimento}
                        size="small"
                        sx={{
                          color: cores[item.sentimento],
                          backgroundColor: `${cores[item.sentimento]}18`,
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {item.comentario || 'Sem comentário.'}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary" py={2}>
                  Nenhuma avaliação cadastrada.
                </Typography>
              )}
            </Box>
          </Paper>
        </>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="caption" color="text.secondary">
          Easy Manager · Painel da empresa
        </Typography>
      </Box>
    </Box>
  );
}

export default Painel;
