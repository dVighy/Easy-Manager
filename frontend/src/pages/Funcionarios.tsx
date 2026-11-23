import { useEffect, useMemo, useState, type FormEvent } from 'react';
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
  UserPlus,
  Search,
  Users,
  UserCheck,
  UserX,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';

interface Empresa {
  id: number;
  nome?: string;
}

interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  email?: string | null;
  telefone?: string | null;
  ativo: boolean;
  empresa?: Empresa;
}

interface FormularioFuncionario {
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  ativo: boolean;
}

const API = 'http://localhost:8080/api/funcionarios';

const formularioInicial: FormularioFuncionario = {
  nome: '',
  cargo: '',
  email: '',
  telefone: '',
  ativo: true,
};

export default function Funcionarios() {
  const { empresaId } = useParams();

  const idEmpresa = Number(empresaId);

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Funcionario | null>(null);

  const [formulario, setFormulario] =
    useState<FormularioFuncionario>(formularioInicial);

  const [salvando, setSalvando] = useState(false);

  const [snackbar, setSnackbar] = useState({
    aberto: false,
    mensagem: '',
    tipo: 'success' as 'success' | 'error',
  });

  async function carregarFuncionarios() {
    setLoading(true);
    setErro('');

    try {
      if (!Number.isFinite(idEmpresa) || idEmpresa <= 0) {
        throw new Error('ID da empresa inválido.');
      }

      const response = await fetch(`${API}/empresa/${idEmpresa}`);

      if (!response.ok) {
        throw new Error('Não foi possível carregar os funcionários.');
      }

      const dados: Funcionario[] = await response.json();

      setFuncionarios(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar funcionários.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarFuncionarios();
  }, [empresaId]);

  const funcionariosFiltrados = useMemo(() => {
    return funcionarios.filter((funcionario) => {
      const termo = busca.toLowerCase();

      const correspondeBusca =
        funcionario.nome?.toLowerCase().includes(termo) ||
        funcionario.cargo?.toLowerCase().includes(termo) ||
        funcionario.email?.toLowerCase().includes(termo);

      const correspondeStatus =
        filtroStatus === 'todos' ||
        (filtroStatus === 'ativos' && funcionario.ativo) ||
        (filtroStatus === 'inativos' && !funcionario.ativo);

      return correspondeBusca && correspondeStatus;
    });
  }, [funcionarios, busca, filtroStatus]);

  const totalAtivos = funcionarios.filter((f) => f.ativo).length;
  const totalInativos = funcionarios.filter((f) => !f.ativo).length;

  function abrirCadastro() {
    setEditando(null);
    setFormulario(formularioInicial);
    setModalAberto(true);
  }

  function abrirEdicao(funcionario: Funcionario) {
    setEditando(funcionario);

    setFormulario({
      nome: funcionario.nome ?? '',
      cargo: funcionario.cargo ?? '',
      email: funcionario.email ?? '',
      telefone: funcionario.telefone ?? '',
      ativo: funcionario.ativo,
    });

    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditando(null);
    setFormulario(formularioInicial);
  }

  function mostrarMensagem(
    mensagem: string,
    tipo: 'success' | 'error' = 'success',
  ) {
    setSnackbar({
      aberto: true,
      mensagem,
      tipo,
    });
  }

  async function salvarFuncionario(event: FormEvent) {
    event.preventDefault();

    if (!formulario.nome.trim() || !formulario.cargo.trim()) {
      mostrarMensagem('Preencha o nome e o cargo.', 'error');
      return;
    }

    setSalvando(true);

    const payload = {
      nome: formulario.nome.trim(),
      cargo: formulario.cargo.trim(),
      email: formulario.email.trim() || null,
      telefone: formulario.telefone.trim() || null,
      ativo: formulario.ativo,
      empresa: {
        id: idEmpresa,
      },
    };

    try {
      const url = editando
        ? `${API}/${editando.id}`
        : API;

      const response = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const mensagem = await response.text();

        throw new Error(
          mensagem || 'Não foi possível salvar o funcionário.',
        );
      }

      fecharModal();

      await carregarFuncionarios();

      mostrarMensagem(
        editando
          ? 'Funcionário atualizado com sucesso!'
          : 'Funcionário cadastrado com sucesso!',
      );
    } catch (error) {
      mostrarMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar funcionário.',
        'error',
      );
    } finally {
      setSalvando(false);
    }
  }

  async function alterarStatus(funcionario: Funcionario) {
    try {
      const novoStatus = !funcionario.ativo;

      const response = await fetch(
        `${API}/${funcionario.id}/status?ativo=${novoStatus}`,
        {
          method: 'PATCH',
        },
      );

      if (!response.ok) {
        throw new Error('Não foi possível alterar o status.');
      }

      await carregarFuncionarios();

      mostrarMensagem(
        novoStatus
          ? 'Funcionário ativado!'
          : 'Funcionário desativado!',
      );
    } catch (error) {
      mostrarMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao alterar status.',
        'error',
      );
    }
  }

  async function excluirFuncionario(funcionario: Funcionario) {
    const confirmar = window.confirm(
      `Deseja realmente excluir ${funcionario.nome}?`,
    );

    if (!confirmar) return;

    try {
      const response = await fetch(`${API}/${funcionario.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Não foi possível excluir o funcionário.');
      }

      await carregarFuncionarios();

      mostrarMensagem('Funcionário excluído com sucesso!');
    } catch (error) {
      mostrarMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir funcionário.',
        'error',
      );
    }
  }

  function iniciais(nome: string) {
    return nome
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join('');
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f7fb', minHeight: '100%' }}>
      {/* CABEÇALHO */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="#172b4d">
            Funcionários
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Gerencie os colaboradores da empresa.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<UserPlus size={18} />}
          onClick={abrirCadastro}
          sx={{
            bgcolor: '#2563eb',
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1.2,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#1d4ed8',
              boxShadow: 'none',
            },
          }}
        >
          Adicionar funcionário
        </Button>
      </Box>

      {/* INDICADORES */}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, 1fr)',
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 3, border: '1px solid #e5eaf1' }}
        >
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" variant="body2">
                Total de funcionários
              </Typography>

              <Typography variant="h4" fontWeight={700} mt={1}>
                {funcionarios.length}
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
              <Users size={22} />
            </Avatar>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 3, border: '1px solid #e5eaf1' }}
        >
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" variant="body2">
                Funcionários ativos
              </Typography>

              <Typography variant="h4" fontWeight={700} mt={1}>
                {totalAtivos}
              </Typography>
            </Box>

            <Avatar
              sx={{
                bgcolor: '#e6f7ee',
                color: '#16a34a',
                width: 48,
                height: 48,
              }}
            >
              <UserCheck size={22} />
            </Avatar>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 3, border: '1px solid #e5eaf1' }}
        >
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" variant="body2">
                Funcionários inativos
              </Typography>

              <Typography variant="h4" fontWeight={700} mt={1}>
                {totalInativos}
              </Typography>
            </Box>

            <Avatar
              sx={{
                bgcolor: '#fff1f2',
                color: '#dc2626',
                width: 48,
                height: 48,
              }}
            >
              <UserX size={22} />
            </Avatar>
          </Box>
        </Paper>
      </Box>

      {/* LISTAGEM */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e5eaf1',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          <TextField
            size="small"
            placeholder="Buscar funcionário..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            sx={{ maxWidth: { md: 380 }, width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            size="small"
            select
            label="Status"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
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
              Carregando funcionários...
            </Typography>
          </Box>
        ) : erro ? (
          <Box p={3}>
            <Alert severity="error">{erro}</Alert>

            <Button onClick={carregarFuncionarios} sx={{ mt: 2 }}>
              Tentar novamente
            </Button>
          </Box>
        ) : funcionariosFiltrados.length === 0 ? (
          <Box
            sx={{
              py: 7,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Users size={40} color="#94a3b8" />

            <Typography fontWeight={600} mt={2}>
              Nenhum funcionário encontrado
            </Typography>

            <Typography color="text.secondary" mt={1}>
              {funcionarios.length === 0
                ? 'Cadastre o primeiro funcionário desta empresa.'
                : 'Tente alterar os filtros da busca.'}
            </Typography>

            {funcionarios.length === 0 && (
              <Button
                variant="contained"
                startIcon={<UserPlus size={18} />}
                onClick={abrirCadastro}
                sx={{ mt: 3, textTransform: 'none' }}
              >
                Cadastrar funcionário
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 750 }}>
              {/* CABEÇALHO DA TABELA */}

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 2fr 1.2fr 1fr',
                  bgcolor: '#f8fafc',
                  px: 3,
                  py: 2,
                  gap: 2,
                }}
              >
                {['Funcionário', 'Cargo', 'Contato', 'Status', 'Ações'].map(
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

              {/* LINHAS */}

              {funcionariosFiltrados.map((funcionario) => (
                <Box
                  key={funcionario.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 2fr 1fr 1fr',
                    px: 3,
                    py: 2,
                    gap: 2,
                    alignItems: 'center',
                    borderTop: '1px solid #edf0f5',
                    '&:hover': {
                      bgcolor: '#fafcff',
                    },
                  }}
                >
                  {/* FUNCIONÁRIO */}

                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar
                      sx={{
                        bgcolor: '#e8f0ff',
                        color: '#2563eb',
                        fontWeight: 600,
                      }}
                    >
                      {iniciais(funcionario.nome || '?')}
                    </Avatar>

                    <Box>
                      <Typography fontWeight={600}>
                        {funcionario.nome}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {funcionario.empresa?.nome || 'Empresa'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* CARGO */}

                  <Typography variant="body2">
                    {funcionario.cargo || 'Não informado'}
                  </Typography>

                  {/* CONTATO */}

                  <Box>
                    <Typography variant="body2">
                      {funcionario.email || 'Email não informado'}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {funcionario.telefone || 'Telefone não informado'}
                    </Typography>
                  </Box>

                  {/* STATUS */}

                  <Chip
                    label={funcionario.ativo ? 'Ativo' : 'Inativo'}
                    size="small"
                    sx={{
                      width: 'fit-content',
                      bgcolor: funcionario.ativo ? '#e6f7ee' : '#fff1f2',
                      color: funcionario.ativo ? '#15803d' : '#dc2626',
                      fontWeight: 600,
                    }}
                  />

                  {/* AÇÕES */}

                  <Box display="flex" gap={0.5}>
                    <IconButton
                      size="small"
                      title="Editar"
                      onClick={() => abrirEdicao(funcionario)}
                    >
                      <Pencil size={18} />
                    </IconButton>

                    <IconButton
                      size="small"
                      title={
                        funcionario.ativo
                          ? 'Desativar'
                          : 'Ativar'
                      }
                      onClick={() => alterarStatus(funcionario)}
                    >
                      {funcionario.ativo ? (
                        <UserX size={18} />
                      ) : (
                        <UserCheck size={18} />
                      )}
                    </IconButton>

                    <IconButton
                      size="small"
                      title="Excluir"
                      onClick={() => excluirFuncionario(funcionario)}
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

        {/* RODAPÉ */}

        {!loading && !erro && funcionariosFiltrados.length > 0 && (
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: '#fafbfd',
              borderTop: '1px solid #edf0f5',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Exibindo {funcionariosFiltrados.length} de {funcionarios.length} funcionários
            </Typography>
          </Box>
        )}
      </Paper>

      {/* MODAL DE CADASTRO / EDIÇÃO */}

      <Dialog
        open={modalAberto}
        onClose={fecharModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {editando
                ? 'Editar funcionário'
                : 'Novo funcionário'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Preencha as informações do colaborador.
            </Typography>
          </Box>

          <IconButton onClick={fecharModal}>
            <X size={20} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <Box component="form" onSubmit={salvarFuncionario}>
          <DialogContent sx={{ pt: 3 }}>
            <Box display="flex" flexDirection="column" gap={2.5}>
              <TextField
                label="Nome completo"
                required
                fullWidth
                value={formulario.nome}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    nome: e.target.value,
                  })
                }
              />

              <TextField
                label="Cargo"
                required
                fullWidth
                value={formulario.cargo}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    cargo: e.target.value,
                  })
                }
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formulario.email}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    email: e.target.value,
                  })
                }
              />

              <TextField
                label="Telefone"
                fullWidth
                value={formulario.telefone}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    telefone: e.target.value,
                  })
                }
              />

              {editando && (
                <TextField
                  label="Status"
                  select
                  fullWidth
                  value={formulario.ativo ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      ativo: e.target.value === 'true',
                    })
                  }
                >
                  <MenuItem value="true">Ativo</MenuItem>
                  <MenuItem value="false">Inativo</MenuItem>
                </TextField>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={fecharModal}
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={salvando}
              sx={{
                textTransform: 'none',
                bgcolor: '#2563eb',
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
                  : 'Cadastrar funcionário'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* FEEDBACK */}

      <Snackbar
        open={snackbar.aberto}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar({ ...snackbar, aberto: false })
        }
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert
          severity={snackbar.tipo}
          onClose={() =>
            setSnackbar({ ...snackbar, aberto: false })
          }
          variant="filled"
        >
          {snackbar.mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}