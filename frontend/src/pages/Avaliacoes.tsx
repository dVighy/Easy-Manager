
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Rating,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import {
  MessageSquare,
  Plus,
  Search,
  Star,
  Trash2,
  Pencil,
  X,
} from 'lucide-react';

interface AvaliacaoAPI {
  id: number;
  comentario: string;
  nota: number;
  sentimento?: string;
  data?: string;
  cliente?: {
    id: number;
    nome: string;
  };
  unidade?: {
    id: number;
    nome: string;
  };
}

interface Avaliacao {
  id: number;
  cliente: string;
  comentario: string;
  data: string;
  sentimento: 'Positivo' | 'Neutro' | 'Negativo';
  nota: number;
  unidade: string;
}

interface Cliente {
  id: number;
  nome: string;
}

interface Unidade {
  id: number;
  nome: string;
}

const API = 'http://localhost:8080/api';

const sentimentoPorNota = (nota: number): Avaliacao['sentimento'] => {
  if (nota >= 4) return 'Positivo';
  if (nota === 3) return 'Neutro';
  return 'Negativo';
};

const normalizarSentimento = (
  sentimento?: string,
  nota = 3,
): Avaliacao['sentimento'] => {
  const valor = sentimento?.toLowerCase();

  if (valor?.includes('posit')) return 'Positivo';
  if (valor?.includes('negat')) return 'Negativo';
  if (valor?.includes('neutr')) return 'Neutro';

  return sentimentoPorNota(nota);
};

const formatarData = (data?: string) => {
  if (!data) return 'Data não informada';

  const dataFormatada = new Date(data);

  if (Number.isNaN(dataFormatada.getTime())) {
    return 'Data não informada';
  }

  return dataFormatada.toLocaleDateString('pt-BR');
};

export default function Avaliacoes() {
  const { empresaId } = useParams();

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  const [dialogAberto, setDialogAberto] = useState(false);
  const [editando, setEditando] = useState<number | null>(null);

  const [clienteId, setClienteId] = useState('');
  const [unidadeId, setUnidadeId] = useState('');
  const [nota, setNota] = useState<number | null>(5);
  const [comentario, setComentario] = useState('');
  const [sentimento, setSentimento] = useState('Positivo');

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const carregarAvaliacoes = useCallback(async () => {
    if (!empresaId) return;

    try {
      const resposta = await fetch(
        `${API}/avaliacoes/empresa/${empresaId}`,
      );

      if (!resposta.ok) {
        throw new Error('Não foi possível carregar as avaliações.');
      }

      const dados: AvaliacaoAPI[] = await resposta.json();

      setAvaliacoes(
        dados.map((item) => ({
          id: item.id,
          cliente: item.cliente?.nome ?? 'Cliente não identificado',
          comentario: item.comentario ?? '',
          data: formatarData(item.data),
          sentimento: normalizarSentimento(item.sentimento, item.nota),
          nota: item.nota,
          unidade: item.unidade?.nome ?? 'Unidade não identificada',
        })),
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar avaliações.',
      );
    }
  }, [empresaId]);

  const carregarOpcoes = useCallback(async () => {
    if (!empresaId) return;

    try {
      const [clientesResposta, unidadesResposta] = await Promise.all([
        fetch(`${API}/clientes/empresa/${empresaId}`),
        fetch(`${API}/unidades/empresa/${empresaId}`),
      ]);

      if (!clientesResposta.ok || !unidadesResposta.ok) {
        throw new Error('Não foi possível carregar clientes e unidades.');
      }

      const clientesDados: Cliente[] = await clientesResposta.json();
      const unidadesDados: Unidade[] = await unidadesResposta.json();

      setClientes(clientesDados);
      setUnidades(unidadesDados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar opções do formulário.',
      );
    }
  }, [empresaId]);

  useEffect(() => {
    carregarAvaliacoes();
    carregarOpcoes();
  }, [carregarAvaliacoes, carregarOpcoes]);

  const avaliacoesFiltradas = useMemo(() => {
    return avaliacoes.filter((avaliacao) => {
      const correspondeBusca =
        avaliacao.cliente.toLowerCase().includes(busca.toLowerCase()) ||
        avaliacao.comentario.toLowerCase().includes(busca.toLowerCase()) ||
        avaliacao.unidade.toLowerCase().includes(busca.toLowerCase());

      const correspondeFiltro =
        filtro === 'Todos' || avaliacao.sentimento === filtro;

      return correspondeBusca && correspondeFiltro;
    });
  }, [avaliacoes, busca, filtro]);

  const mediaNotas = avaliacoes.length
    ? avaliacoes.reduce((total, item) => total + item.nota, 0) /
      avaliacoes.length
    : 0;

  const abrirCadastro = () => {
    setEditando(null);
    setClienteId('');
    setUnidadeId('');
    setNota(5);
    setComentario('');
    setSentimento('Positivo');
    setErro('');
    setDialogAberto(true);
  };

  const abrirEdicao = (avaliacao: Avaliacao) => {
    const original = avaliacoes.find((item) => item.id === avaliacao.id);
    if (!original) return;

    setEditando(original.id);
    setComentario(original.comentario);
    setNota(original.nota);
    setSentimento(original.sentimento);

    // Os IDs são recuperados separadamente para edição.
    const itemOriginal = avaliacoes.find((item) => item.id === original.id);
    const clienteEncontrado = clientes.find(
      (cliente) => cliente.nome === itemOriginal?.cliente,
    );
    const unidadeEncontrada = unidades.find(
      (unidade) => unidade.nome === itemOriginal?.unidade,
    );

    setClienteId(clienteEncontrado ? String(clienteEncontrado.id) : '');
    setUnidadeId(unidadeEncontrada ? String(unidadeEncontrada.id) : '');
    setErro('');
    setDialogAberto(true);
  };

  const salvarAvaliacao = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!empresaId || !clienteId || !unidadeId || !nota) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    setCarregando(true);
    setErro('');

    const payload = {
      nota,
      comentario,
      sentimento,
      empresa: { id: Number(empresaId) },
      cliente: { id: Number(clienteId) },
      unidade: { id: Number(unidadeId) },
    };

    try {
      const url = editando
        ? `${API}/avaliacoes/${editando}`
        : `${API}/avaliacoes`;

      const resposta = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resposta.ok) {
        const detalhe = await resposta.text();
        throw new Error(detalhe || 'Não foi possível salvar a avaliação.');
      }

      setDialogAberto(false);
      setMensagem(
        editando
          ? 'Avaliação atualizada com sucesso!'
          : 'Avaliação cadastrada com sucesso!',
      );

      await carregarAvaliacoes();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar avaliação.',
      );
    } finally {
      setCarregando(false);
    }
  };

  const excluirAvaliacao = async (id: number) => {
    const confirmar = window.confirm(
      'Tem certeza de que deseja excluir esta avaliação?',
    );

    if (!confirmar) return;

    try {
      const resposta = await fetch(`${API}/avaliacoes/${id}`, {
        method: 'DELETE',
      });

      if (!resposta.ok) {
        throw new Error('Não foi possível excluir a avaliação.');
      }

      setMensagem('Avaliação excluída com sucesso!');
      await carregarAvaliacoes();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir avaliação.',
      );
    }
  };

  const corSentimento = (valor: Avaliacao['sentimento']) => {
    if (valor === 'Positivo') return 'success';
    if (valor === 'Negativo') return 'error';
    return 'warning';
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f7f9fc', minHeight: '100%' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="#172b4d">
            Avaliações
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Acompanhe a opinião dos clientes sobre os serviços.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={abrirCadastro}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            backgroundColor: '#2563eb',
          }}
        >
          Nova avaliação
        </Button>
      </Stack>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }}
        gap={2}
        mb={3}
      >
        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <MessageSquare size={20} color="#2563eb" />
            <Typography color="text.secondary">Total de avaliações</Typography>
          </Stack>
          <Typography variant="h4" fontWeight={700} mt={1}>
            {avaliacoes.length}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Star size={20} color="#e6a23c" />
            <Typography color="text.secondary">Nota média</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} mt={1}>
            <Typography variant="h4" fontWeight={700}>
              {mediaNotas.toFixed(1)}
            </Typography>
            <Rating value={mediaNotas} precision={0.1} readOnly size="small" />
          </Stack>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Typography color="text.secondary">Avaliações positivas</Typography>
          <Typography variant="h4" fontWeight={700} mt={1}>
            {avaliacoes.length
              ? Math.round(
                  (avaliacoes.filter((item) => item.sentimento === 'Positivo')
                    .length /
                    avaliacoes.length) *
                    100,
                )
              : 0}
            %
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ md: 'center' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por cliente, comentário ou unidade..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            InputProps={{
              startAdornment: (
                <Box sx={{ display: 'flex', mr: 1, color: 'text.secondary' }}>
                  <Search size={18} />
                </Box>
              ),
            }}
          />

          <TextField
            select
            size="small"
            label="Sentimento"
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
            sx={{ minWidth: { xs: '100%', md: 180 } }}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Positivo">Positivo</MenuItem>
            <MenuItem value="Neutro">Neutro</MenuItem>
            <MenuItem value="Negativo">Negativo</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      <Stack spacing={2}>
        {avaliacoesFiltradas.length === 0 ? (
          <Paper sx={{ p: 5, borderRadius: 3, textAlign: 'center' }}>
            <MessageSquare size={36} color="#94a3b8" />
            <Typography fontWeight={600} mt={2}>
              Nenhuma avaliação encontrada
            </Typography>
            <Typography color="text.secondary" variant="body2" mt={0.5}>
              Cadastre uma avaliação ou altere os filtros da pesquisa.
            </Typography>
          </Paper>
        ) : (
          avaliacoesFiltradas.map((avaliacao) => (
            <Paper key={avaliacao.id} sx={{ p: 2.5, borderRadius: 3 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: '#dbeafe', color: '#1d4ed8' }}>
                    {avaliacao.cliente.charAt(0).toUpperCase()}
                  </Avatar>

                  <Box>
                    <Typography fontWeight={700}>
                      {avaliacao.cliente}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {avaliacao.unidade} • {avaliacao.data}
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  flexWrap="wrap"
                >
                  <Chip
                    label={avaliacao.sentimento}
                    color={corSentimento(avaliacao.sentimento)}
                    size="small"
                  />

                  <IconButton
                    size="small"
                    onClick={() => abrirEdicao(avaliacao)}
                    aria-label="Editar avaliação"
                  >
                    <Pencil size={17} />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => excluirAvaliacao(avaliacao.id)}
                    aria-label="Excluir avaliação"
                  >
                    <Trash2 size={17} />
                  </IconButton>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Rating value={avaliacao.nota} readOnly />

              <Typography mt={1.5} color="text.secondary">
                {avaliacao.comentario || 'Sem comentário.'}
              </Typography>
            </Paper>
          ))
        )}
      </Stack>

      <Dialog
        open={dialogAberto}
        onClose={() => setDialogAberto(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box
          component="form"
          onSubmit={salvarAvaliacao}
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={700} variant="h6">
                {editando ? 'Editar avaliação' : 'Nova avaliação'}
              </Typography>
              <IconButton onClick={() => setDialogAberto(false)}>
                <X size={20} />
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2.5} pt={1}>
              <TextField
                select
                label="Cliente"
                value={clienteId}
                onChange={(event) => setClienteId(event.target.value)}
                required
                fullWidth
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Unidade"
                value={unidadeId}
                onChange={(event) => setUnidadeId(event.target.value)}
                required
                fullWidth
              >
                {unidades.map((unidade) => (
                  <MenuItem key={unidade.id} value={unidade.id}>
                    {unidade.nome}
                  </MenuItem>
                ))}
              </TextField>

              <Box>
                <Typography variant="body2" fontWeight={600} mb={1}>
                  Nota da avaliação
                </Typography>
                <Rating
                  value={nota}
                  onChange={(_, novoValor) => {
                    setNota(novoValor);
                    if (novoValor) {
                      setSentimento(sentimentoPorNota(novoValor));
                    }
                  }}
                  size="large"
                />
              </Box>

              <TextField
                select
                label="Sentimento"
                value={sentimento}
                onChange={(event) => setSentimento(event.target.value)}
                fullWidth
              >
                <MenuItem value="POSITIVO">Positivo</MenuItem>
                <MenuItem value="NEUTRO">Neutro</MenuItem>
                <MenuItem value="NEGATIVO">Negativo</MenuItem>
              </TextField>

              <TextField
                label="Comentário"
                value={comentario}
                onChange={(event) => setComentario(event.target.value)}
                multiline
                minRows={4}
                fullWidth
                inputProps={{ maxLength: 2000 }}
              />

              {erro && <Alert severity="error">{erro}</Alert>}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setDialogAberto(false)}
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={carregando}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              {carregando ? 'Salvando...' : 'Salvar avaliação'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={Boolean(mensagem)}
        autoHideDuration={3500}
        onClose={() => setMensagem('')}
        message={mensagem}
      />
    </Box>
  );
}
