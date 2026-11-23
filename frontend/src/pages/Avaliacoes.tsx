
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Alert,
} from '@mui/material';

import {
  Search,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Eye,
  Filter,
  Sparkles,
  CalendarDays
} from 'lucide-react';

type Sentimento = 'Positivo' | 'Neutro' | 'Negativo';

interface Avaliacao {
  id: number;
  cliente: string;
  comentario: string;
  data: string;
  sentimento: Sentimento;
  assuntos: string[];
  interpretacao: string;
  nota: number;
}

const cores: Record<Sentimento, string> = {
  Positivo: '#319B72',
  Neutro: '#C59637',
  Negativo: '#D66B70'
};

function Avaliacoes() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');
  const [selecionada, setSelecionada] = useState<Avaliacao | null>(null);
  const { empresaId } = useParams();

const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState('');

  const filtradas = useMemo(() => {
    return avaliacoes.filter((item) => {
      const correspondeBusca =
        item.cliente.toLowerCase().includes(busca.toLowerCase()) ||
        item.comentario.toLowerCase().includes(busca.toLowerCase()) ||
        item.assuntos.some((assunto) =>
          assunto.toLowerCase().includes(busca.toLowerCase())
        );

      const correspondeFiltro =
        filtro === 'Todos' || item.sentimento === filtro;

      return correspondeBusca && correspondeFiltro;
    });
  }, [avaliacoes, busca, filtro]);

  const quantidadePositivas = avaliacoes.filter(
    (item) => item.sentimento === 'Positivo'
  ).length;

  const quantidadeNeutras = avaliacoes.filter(
    (item) => item.sentimento === 'Neutro'
  ).length;

  const quantidadeNegativas = avaliacoes.filter(
    (item) => item.sentimento === 'Negativo'
  ).length;

  const indicadores = [
    {
      titulo: 'Total de avaliações',
      valor: avaliacoes.length,
      descricao: 'Comentários recebidos',
      icon: MessageSquare,
      cor: '#5578AD'
    },
    {
      titulo: 'Positivas',
      valor: quantidadePositivas,
      descricao: 'Experiências satisfatórias',
      icon: ThumbsUp,
      cor: '#319B72'
    },
    {
      titulo: 'Neutras',
      valor: quantidadeNeutras,
      descricao: 'Experiências sem tendência clara',
      icon: Meh,
      cor: '#C59637'
    },
    {
      titulo: 'Negativas',
      valor: quantidadeNegativas,
      descricao: 'Experiências insatisfatórias',
      icon: ThumbsDown,
      cor: '#D66B70'
    }
  ];

  const percentual = (valor: number) =>
  avaliacoes.length === 0
    ? '0.0'
    : ((valor / avaliacoes.length) * 100).toFixed(1);

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

      const dados = await resposta.json();

      const formatadas: Avaliacao[] = dados.map((item: any) => ({
        id: item.id,
        cliente: item.cliente?.nome ?? 'Cliente não identificado',
        comentario: item.comentario ?? '',
        data: item.data
          ? new Date(item.data).toLocaleDateString('pt-BR')
          : '',
        sentimento: ['Positivo', 'Neutro', 'Negativo'].includes(item.sentimento)
          ? item.sentimento as Sentimento
          : 'Neutro',
        assuntos: [],
        interpretacao: 'Análise automatizada ainda não integrada.',
        nota: item.nota
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

  return (
    <Box sx={{ width: '100%' }}>

      {/* Cabeçalho */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="#1E1E2F">
          Avaliações e satisfação
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Acompanhe os comentários e identifique a percepção dos clientes.
        </Typography>
      </Box>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

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
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="body2" color="text.secondary">
                  {item.titulo}
                </Typography>

                <Icon size={21} color={item.cor} />
              </Box>

              <Typography variant="h4" fontWeight={700} color="#1E1E2F" sx={{ mt: 2 }}>
                {item.valor}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {item.descricao}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Distribuição dos sentimentos */}
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
          Distribuição dos sentimentos
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Classificação demonstrativa dos comentários
        </Typography>

        <Box sx={{ display: 'flex', height: 12, borderRadius: 5, overflow: 'hidden', mt: 3 }}>
          <Box sx={{ width: `${percentual(quantidadePositivas)}%`, backgroundColor: '#319B72' }} />
          <Box sx={{ width: `${percentual(quantidadeNeutras)}%`, backgroundColor: '#E5B95C' }} />
          <Box sx={{ width: `${percentual(quantidadeNegativas)}%`, backgroundColor: '#D66B70' }} />
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mt: 2
        }}>
          <Typography variant="body2" color="#319B72" fontWeight={600}>
            Positivas · {percentual(quantidadePositivas)}%
          </Typography>

          <Typography variant="body2" color="#C59637" fontWeight={600}>
            Neutras · {percentual(quantidadeNeutras)}%
          </Typography>

          <Typography variant="body2" color="#D66B70" fontWeight={600}>
            Negativas · {percentual(quantidadeNegativas)}%
          </Typography>
        </Box>
      </Paper>

      {/* Lista de avaliações */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #E4EAF2',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} color="#1E1E2F">
            Comentários dos clientes
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Consulte e visualize a classificação de cada avaliação.
          </Typography>

          {/* Pesquisa e filtros */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 3,
              flexWrap: 'wrap'
            }}
          >
            <TextField
              placeholder="Pesquisar cliente, comentário ou assunto..."
              size="small"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              sx={{
                flex: 1,
                minWidth: 220,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#71829A" />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              select
              size="small"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              sx={{
                minWidth: 170,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Filter size={17} color="#71829A" />
                  </InputAdornment>
                )
              }}
            >
              <MenuItem value="Todos">Todos os sentimentos</MenuItem>
              <MenuItem value="Positivo">Positivos</MenuItem>
              <MenuItem value="Neutro">Neutros</MenuItem>
              <MenuItem value="Negativo">Negativos</MenuItem>
            </TextField>
          </Box>
        </Box>

        <Divider />

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead sx={{ backgroundColor: '#F7F9FC' }}>
              <TableRow>
                <TableCell><b>Cliente</b></TableCell>
                <TableCell><b>Comentário</b></TableCell>
                <TableCell><b>Data</b></TableCell>
                <TableCell><b>Sentimento</b></TableCell>
                <TableCell align="center"><b>Ação</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {carregando && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    Carregando avaliações...
                  </TableCell>
                </TableRow>
              )}
              {filtradas.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          backgroundColor: '#E8EEF9',
                          color: '#1E1E2F',
                          fontSize: 13
                        }}
                      >
                        {item.cliente.slice(-3)}
                      </Avatar>

                      <Typography variant="body2" fontWeight={600}>
                        {item.cliente}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {item.comentario}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {item.data}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={item.sentimento}
                      size="small"
                      sx={{
                        color: cores[item.sentimento],
                        backgroundColor: `${cores[item.sentimento]}18`,
                        fontWeight: 600
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      size="small"
                      onClick={() => setSelecionada(item)}
                      startIcon={<Eye size={16} />}
                      sx={{
                        color: '#1E1E2F',
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {!carregando && filtradas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    Nenhuma avaliação encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Exibindo {filtradas.length} de {avaliacoes.length} avaliações.
          </Typography>
        </Box>
      </Paper>

      {/* Detalhes da avaliação */}
      <Dialog
        open={Boolean(selecionada)}
        onClose={() => setSelecionada(null)}
        fullWidth
        maxWidth="sm"
      >
        {selecionada && (
          <>
            <DialogTitle sx={{ color: '#1E1E2F', fontWeight: 700 }}>
              Detalhes da avaliação
            </DialogTitle>

            <DialogContent dividers>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography fontWeight={600}>
                  {selecionada.cliente}
                </Typography>

                <Chip
                  label={selecionada.sentimento}
                  size="small"
                  sx={{
                    color: cores[selecionada.sentimento],
                    backgroundColor: `${cores[selecionada.sentimento]}18`,
                    fontWeight: 600
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CalendarDays size={16} color="#71829A" />
                <Typography variant="caption" color="text.secondary">
                  {selecionada.data}
                </Typography>
              </Box>

              <Typography variant="subtitle2" color="#1E1E2F" sx={{ mb: 1 }}>
                Comentário original
              </Typography>

              <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F4F7FB', borderRadius: 2, mb: 3 }}>
                <Typography variant="body2" lineHeight={1.8}>
                  {selecionada.comentario}
                </Typography>
              </Paper>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Sparkles size={19} color="#5578AD" />
                <Typography variant="subtitle2" fontWeight={700} color="#1E1E2F">
                  Análise demonstrativa
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
                {selecionada.interpretacao}
              </Typography>

              <Typography variant="subtitle2" color="#1E1E2F" sx={{ mb: 1 }}>
                Assuntos identificados
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selecionada.assuntos.map((assunto) => (
                  <Chip
                    key={assunto}
                    label={assunto}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 3 }}
              >
                Classificação e interpretação ilustrativas. O processamento
                automatizado por NLP ainda não está integrado nesta versão.
              </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setSelecionada(null)}
                sx={{
                  color: '#1E1E2F',
                  textTransform: 'none'
                }}
              >
                Fechar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </Box>
  );
}

export default Avaliacoes;
