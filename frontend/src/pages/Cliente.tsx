import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';

import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';

import {
  UserRound,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';

interface Cliente {
  id: number;
  nome: string;
  telefone?: string;
  email?: string;
  empresa?: { id: number };
  dataCadastro?: string;
}

const API = 'http://localhost:8080/api/clientes';

export default function Clientes() {
  const { empresaId } = useParams();
  const idEmpresa = Number(empresaId);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);

  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
  });

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipo, setTipo] = useState<'success' | 'error'>('success');

  async function carregar() {
    setLoading(true);
    setErro('');

    try {
      const response = await fetch(`${API}/empresa/${idEmpresa}`);

      if (!response.ok) {
        throw new Error('Não foi possível carregar os clientes.');
      }

      setClientes(await response.json());
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar clientes.',
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
    setForm({ nome: '', telefone: '', email: '' });
    setAberto(true);
  }

  function editar(cliente: Cliente) {
    setEditando(cliente);

    setForm({
      nome: cliente.nome ?? '',
      telefone: cliente.telefone ?? '',
      email: cliente.email ?? '',
    });

    setAberto(true);
  }

  function fechar() {
    setAberto(false);
    setEditando(null);
    setForm({ nome: '', telefone: '', email: '' });
  }

  async function salvar(event: FormEvent) {
    event.preventDefault();

    if (!form.nome.trim()) {
      notificar('O nome é obrigatório.', 'error');
      return;
    }

    setSalvando(true);

    const payload = {
      nome: form.nome.trim(),
      telefone: form.telefone.trim() || null,
      email: form.email.trim() || null,
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
            throw new Error(texto || 'Erro ao salvar cliente.');
        }

        const estavaEditando = editando !== null;

        fechar();
        await carregar();

        notificar(
        estavaEditando
            ? 'Cliente atualizado!'
            : 'Cliente cadastrado!',
        );
    } catch (error) {
        notificar(
            error instanceof Error
            ? error.message
            : 'Erro ao salvar cliente.',
            'error',
        );
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(cliente: Cliente) {
    if (!window.confirm(`Deseja excluir ${cliente.nome}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API}/${cliente.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir cliente.');
      }

      await carregar();
      notificar('Cliente excluído!');
    } catch (error) {
      notificar(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir cliente.',
        'error',
      );
    }
  }

  const filtrados = clientes.filter((cliente) =>
    `${cliente.nome} ${cliente.email ?? ''} ${cliente.telefone ?? ''}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  );

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
            Clientes
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Gerencie os clientes cadastrados na empresa.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<UserPlus size={18} />}
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
          Adicionar cliente
        </Button>
      </Box>

      {/* Indicador */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: '1px solid #e5eaf1',
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total de clientes
            </Typography>

            <Typography variant="h4" fontWeight={700} mt={1}>
              {clientes.length}
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: '#e8f0ff',
              color: '#2563eb',
              width: 48,
              height: 48,
            }}
          >
            <UserRound size={22} />
          </Avatar>
        </Box>
      </Paper>

      {/* Tabela */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e5eaf1',
          overflow: 'hidden',
        }}
      >
        <Box p={3}>
          <TextField
            size="small"
            fullWidth
            placeholder="Buscar cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            sx={{ maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider />

        {loading ? (
          <Box p={4}>
            <Typography color="text.secondary">
              Carregando clientes...
            </Typography>
          </Box>
        ) : erro ? (
          <Box p={3}>
            <Alert severity="error">{erro}</Alert>
            <Button onClick={carregar} sx={{ mt: 2 }}>
              Tentar novamente
            </Button>
          </Box>
        ) : filtrados.length === 0 ? (
          <Box textAlign="center" py={7} px={3}>
            <UserRound size={40} color="#94a3b8" />

            <Typography fontWeight={600} mt={2}>
              Nenhum cliente encontrado
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Cadastre um cliente ou ajuste a busca.
            </Typography>

            {clientes.length === 0 && (
              <Button
                variant="contained"
                onClick={novo}
                sx={{ mt: 3, textTransform: 'none' }}
              >
                Adicionar cliente
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 700 }}>
              <Box
                display="grid"
                gridTemplateColumns="2fr 2fr 1.5fr 1fr"
                gap={2}
                bgcolor="#f8fafc"
                px={3}
                py={2}
              >
                {['Cliente', 'Email', 'Telefone', 'Ações'].map((titulo) => (
                  <Typography
                    key={titulo}
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    {titulo}
                  </Typography>
                ))}
              </Box>

              {filtrados.map((cliente) => (
                <Box
                  key={cliente.id}
                  display="grid"
                  gridTemplateColumns="2fr 2fr 1.5fr 1fr"
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
                      {cliente.nome?.trim().charAt(0).toUpperCase()}
                    </Avatar>

                    <Typography fontWeight={600}>
                      {cliente.nome}
                    </Typography>
                  </Box>

                  <Typography variant="body2">
                    {cliente.email || 'Não informado'}
                  </Typography>

                  <Typography variant="body2">
                    {cliente.telefone || 'Não informado'}
                  </Typography>

                  <Box display="flex" gap={0.5}>
                    <IconButton
                      title="Editar"
                      size="small"
                      onClick={() => editar(cliente)}
                    >
                      <Pencil size={18} />
                    </IconButton>

                    <IconButton
                      title="Excluir"
                      size="small"
                      onClick={() => excluir(cliente)}
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

        {!loading && !erro && filtrados.length > 0 && (
          <Box px={3} py={2} bgcolor="#fafbfd" borderTop="1px solid #edf0f5">
            <Typography variant="body2" color="text.secondary">
              Exibindo {filtrados.length} de {clientes.length} clientes
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
              {editando ? 'Editar cliente' : 'Novo cliente'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Preencha as informações do cliente.
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
                label="Nome completo"
                required
                fullWidth
                value={form.nome}
                onChange={(e) =>
                  setForm({ ...form, nome: e.target.value })
                }
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
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
                  : 'Cadastrar cliente'}
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