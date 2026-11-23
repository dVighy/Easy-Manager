import { useEffect, useState, type FormEvent } from 'react';
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
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';

import {
  MapPin,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';

interface Unidade {
  id: number;
  nome: string;
  endereco?: string;
  telefone?: string;
  ativo: boolean;
  empresa?: { id: number };
}

const API = 'http://localhost:8080/api/unidades';

const inicial = {
  nome: '',
  endereco: '',
  telefone: '',
  ativo: true,
};

export default function Unidades() {
  const { empresaId } = useParams();
  const idEmpresa = Number(empresaId);

  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Unidade | null>(null);
  const [form, setForm] = useState(inicial);
  const [salvando, setSalvando] = useState(false);

  const [mensagem, setMensagem] = useState('');
  const [tipo, setTipo] = useState<'success' | 'error'>('success');

  async function carregar() {
    setLoading(true);
    setErro('');

    try {
      const response = await fetch(`${API}/empresa/${idEmpresa}`);

      if (!response.ok) {
        throw new Error('Erro ao carregar unidades.');
      }

      setUnidades(await response.json());
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar unidades.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [empresaId]);

  function notificar(
    texto: string,
    tipoMensagem: 'success' | 'error' = 'success',
  ) {
    setMensagem(texto);
    setTipo(tipoMensagem);
  }

  function novo() {
    setEditando(null);
    setForm(inicial);
    setAberto(true);
  }

  function editar(unidade: Unidade) {
    setEditando(unidade);

    setForm({
      nome: unidade.nome ?? '',
      endereco: unidade.endereco ?? '',
      telefone: unidade.telefone ?? '',
      ativo: unidade.ativo ?? true,
    });

    setAberto(true);
  }

  function fechar() {
    setAberto(false);
    setEditando(null);
    setForm(inicial);
  }

  async function salvar(event: FormEvent) {
    event.preventDefault();

    if (!form.nome.trim()) {
      notificar('O nome da unidade é obrigatório.', 'error');
      return;
    }

    setSalvando(true);

    const payload = {
      nome: form.nome.trim(),
      endereco: form.endereco.trim() || null,
      telefone: form.telefone.trim() || null,
      ativo: form.ativo,
      empresa: { id: idEmpresa },
    };

    try {
      const response = await fetch(
        editando ? `${API}/${editando.id}` : API,
        {
          method: editando ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const texto = await response.text();
        throw new Error(texto || 'Erro ao salvar unidade.');
      }

      fechar();
      await carregar();

      notificar(
        editando
          ? 'Unidade atualizada!'
          : 'Unidade cadastrada!',
      );
    } catch (error) {
      notificar(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar unidade.',
        'error',
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(unidade: Unidade) {
    if (!window.confirm(`Deseja excluir ${unidade.nome}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API}/${unidade.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Não foi possível excluir a unidade.');
      }

      await carregar();
      notificar('Unidade excluída!');
    } catch (error) {
      notificar(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir unidade.',
        'error',
      );
    }
  }

  async function alterarStatus(unidade: Unidade) {
    try {
      const response = await fetch(`${API}/${unidade.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...unidade,
          ativo: !unidade.ativo,
          empresa: { id: idEmpresa },
        }),
      });

      if (!response.ok) {
        throw new Error('Não foi possível alterar o status.');
      }

      await carregar();
      notificar(unidade.ativo ? 'Unidade desativada!' : 'Unidade ativada!');
    } catch (error) {
      notificar(
        error instanceof Error
          ? error.message
          : 'Erro ao alterar status.',
        'error',
      );
    }
  }

  const filtradas = unidades.filter((unidade) => {
    const termo = busca.toLowerCase();

    const correspondeBusca =
      unidade.nome?.toLowerCase().includes(termo) ||
      unidade.endereco?.toLowerCase().includes(termo);

    const correspondeFiltro =
      filtro === 'todos' ||
      (filtro === 'ativos' && unidade.ativo) ||
      (filtro === 'inativos' && !unidade.ativo);

    return correspondeBusca && correspondeFiltro;
  });

  const ativos = unidades.filter((u) => u.ativo).length;
  const inativos = unidades.filter((u) => !u.ativo).length;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f7fb', minHeight: '100%' }}>
      {/* Cabeçalho */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="#172b4d">
            Unidades
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Gerencie os locais de operação da empresa.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={novo}
          sx={{
            bgcolor: '#2563eb',
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#1d4ed8',
              boxShadow: 'none',
            },
          }}
        >
          Adicionar unidade
        </Button>
      </Box>

      {/* Indicadores */}

      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3,1fr)' }}
        gap={2}
        mb={3}
      >
        {[
          {
            label: 'Total de unidades',
            valor: unidades.length,
            cor: '#2563eb',
            fundo: '#e8f0ff',
          },
          {
            label: 'Unidades ativas',
            valor: ativos,
            cor: '#16a34a',
            fundo: '#e6f7ee',
          },
          {
            label: 'Unidades inativas',
            valor: inativos,
            cor: '#dc2626',
            fundo: '#fff1f2',
          },
        ].map((item) => (
          <Paper
            key={item.label}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e5eaf1',
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>

                <Typography variant="h4" fontWeight={700} mt={1}>
                  {item.valor}
                </Typography>
              </Box>

              <Avatar
                sx={{
                  bgcolor: item.fundo,
                  color: item.cor,
                  width: 48,
                  height: 48,
                }}
              >
                <MapPin size={22} />
              </Avatar>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Listagem */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e5eaf1',
          overflow: 'hidden',
        }}
      >
        <Box
          display="flex"
          gap={2}
          p={3}
          flexDirection={{ xs: 'column', md: 'row' }}
        >
          <TextField
            size="small"
            placeholder="Buscar unidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            sx={{ maxWidth: 380, width: '100%' }}
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
            label="Status"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="ativos">Ativos</MenuItem>
            <MenuItem value="inativos">Inativos</MenuItem>
          </TextField>
        </Box>

        <Divider />

        {loading ? (
          <Box p={4}>
            <Typography color="text.secondary">
              Carregando unidades...
            </Typography>
          </Box>
        ) : erro ? (
          <Box p={3}>
            <Alert severity="error">{erro}</Alert>
            <Button onClick={carregar} sx={{ mt: 2 }}>
              Tentar novamente
            </Button>
          </Box>
        ) : filtradas.length === 0 ? (
          <Box textAlign="center" py={7} px={3}>
            <MapPin size={40} color="#94a3b8" />

            <Typography fontWeight={600} mt={2}>
              Nenhuma unidade encontrada
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Cadastre uma unidade ou ajuste a busca.
            </Typography>

            {unidades.length === 0 && (
              <Button
                variant="contained"
                onClick={novo}
                sx={{ mt: 3, textTransform: 'none' }}
              >
                Adicionar unidade
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 750 }}>
              <Box
                display="grid"
                gridTemplateColumns="2fr 2.5fr 1.5fr 1fr 1fr"
                gap={2}
                bgcolor="#f8fafc"
                px={3}
                py={2}
              >
                {['Unidade', 'Endereço', 'Telefone', 'Status', 'Ações'].map(
                  (titulo) => (
                    <Typography
                      key={titulo}
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      {titulo}
                    </Typography>
                  ),
                )}
              </Box>

              {filtradas.map((unidade) => (
                <Box
                  key={unidade.id}
                  display="grid"
                  gridTemplateColumns="2fr 2.5fr 1.5fr 1fr 1fr"
                  gap={2}
                  px={3}
                  py={2}
                  alignItems="center"
                  borderTop="1px solid #edf0f5"
                  sx={{ '&:hover': { bgcolor: '#fafcff' } }}
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar
                      sx={{
                        bgcolor: '#e8f0ff',
                        color: '#2563eb',
                      }}
                    >
                      <MapPin size={20} />
                    </Avatar>

                    <Typography fontWeight={600}>
                      {unidade.nome}
                    </Typography>
                  </Box>

                  <Typography variant="body2">
                    {unidade.endereco || 'Não informado'}
                  </Typography>

                  <Typography variant="body2">
                    {unidade.telefone || 'Não informado'}
                  </Typography>

                  <Chip
                    size="small"
                    label={unidade.ativo ? 'Ativa' : 'Inativa'}
                    sx={{
                      width: 'fit-content',
                      bgcolor: unidade.ativo ? '#e6f7ee' : '#fff1f2',
                      color: unidade.ativo ? '#15803d' : '#dc2626',
                      fontWeight: 600,
                    }}
                  />

                  <Box display="flex" gap={0.5}>
                    <IconButton
                      title="Editar"
                      size="small"
                      onClick={() => editar(unidade)}
                    >
                      <Pencil size={18} />
                    </IconButton>

                    <IconButton
                      title={unidade.ativo ? 'Desativar' : 'Ativar'}
                      size="small"
                      onClick={() => alterarStatus(unidade)}
                    >
                      <MapPin size={18} />
                    </IconButton>

                    <IconButton
                      title="Excluir"
                      size="small"
                      onClick={() => excluir(unidade)}
                      sx={{ color: '#dc2626' }}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {!loading && !erro && filtradas.length > 0 && (
          <Box px={3} py={2} bgcolor="#fafbfd" borderTop="1px solid #edf0f5">
            <Typography variant="body2" color="text.secondary">
              Exibindo {filtradas.length} de {unidades.length} unidades
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Modal */}

      <Dialog open={aberto} onClose={fechar} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {editando ? 'Editar unidade' : 'Nova unidade'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Preencha os dados do local.
            </Typography>
          </Box>

          <IconButton onClick={fechar}>
            <X size={20} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <Box component="form" onSubmit={salvar}>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2.5}>
              <TextField
                label="Nome da unidade"
                required
                fullWidth
                value={form.nome}
                onChange={(e) =>
                  setForm({ ...form, nome: e.target.value })
                }
              />

              <TextField
                label="Endereço"
                fullWidth
                value={form.endereco}
                onChange={(e) =>
                  setForm({ ...form, endereco: e.target.value })
                }
              />

              <TextField
                label="Telefone"
                fullWidth
                value={form.telefone}
                onChange={(e) =>
                  setForm({ ...form, telefone: e.target.value })
                }
              />

              {editando && (
                <TextField
                  label="Status"
                  select
                  fullWidth
                  value={String(form.ativo)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ativo: e.target.value === 'true',
                    })
                  }
                >
                  <MenuItem value="true">Ativa</MenuItem>
                  <MenuItem value="false">Inativa</MenuItem>
                </TextField>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={fechar} color="inherit">
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={salvando}
              sx={{
                bgcolor: '#2563eb',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#1d4ed8',
                  boxShadow: 'none',
                },
              }}
            >
              {salvando
                ? 'Salvando...'
                : editando
                  ? 'Salvar alterações'
                  : 'Cadastrar unidade'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Snackbar */}

      <Snackbar
        open={!!mensagem}
        autoHideDuration={4000}
        onClose={() => setMensagem('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={tipo}
          variant="filled"
          onClose={() => setMensagem('')}
        >
          {mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}