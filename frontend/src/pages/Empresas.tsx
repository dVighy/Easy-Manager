
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

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
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowRight,
  X,
  Landmark,
} from 'lucide-react';

interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
}

const API = 'http://localhost:8080/api/empresas';

export default function Empresas() {
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [busca, setBusca] = useState('');

  const [dialogAberto, setDialogAberto] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState<number | null>(null);

  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const carregarEmpresas = useCallback(async () => {
    try {
      const resposta = await fetch(API);

      if (!resposta.ok) {
        throw new Error('Não foi possível carregar as empresas.');
      }

      const dados: Empresa[] = await resposta.json();
      setEmpresas(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar empresas.',
      );
    }
  }, []);

  useEffect(() => {
    carregarEmpresas();
  }, [carregarEmpresas]);

  const empresasFiltradas = useMemo(() => {
    return empresas.filter((empresa) =>
      `${empresa.nome} ${empresa.cnpj ?? ''}`
        .toLowerCase()
        .includes(busca.toLowerCase()),
    );
  }, [empresas, busca]);

  const abrirCadastro = () => {
    setEmpresaEditando(null);
    setNome('');
    setCnpj('');
    setErro('');
    setDialogAberto(true);
  };

  const abrirEdicao = (empresa: Empresa) => {
    setEmpresaEditando(empresa.id);
    setNome(empresa.nome);
    setCnpj(empresa.cnpj ?? '');
    setErro('');
    setDialogAberto(true);
  };

  const salvarEmpresa = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nome.trim()) {
      setErro('Informe o nome da empresa.');
      return;
    }

    setCarregando(true);
    setErro('');

    const payload = {
      nome: nome.trim(),
      cnpj: cnpj.trim() || null,
    };

    try {
      const resposta = await fetch(
        empresaEditando ? `${API}/${empresaEditando}` : API,
        {
          method: empresaEditando ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!resposta.ok) {
        const detalhe = await resposta.text();
        throw new Error(
          detalhe || 'Não foi possível salvar a empresa.',
        );
      }

      setDialogAberto(false);
      setMensagem(
        empresaEditando
          ? 'Empresa atualizada com sucesso!'
          : 'Empresa cadastrada com sucesso!',
      );

      await carregarEmpresas();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar empresa.',
      );
    } finally {
      setCarregando(false);
    }
  };

  const excluirEmpresa = async (id: number) => {
    const confirmar = window.confirm(
      'Tem certeza de que deseja excluir esta empresa?',
    );

    if (!confirmar) return;

    try {
      const resposta = await fetch(`${API}/${id}`, {
        method: 'DELETE',
      });

      if (!resposta.ok) {
        const detalhe = await resposta.text();
        throw new Error(
          detalhe || 'Não foi possível excluir a empresa.',
        );
      }

      setMensagem('Empresa excluída com sucesso!');
      await carregarEmpresas();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir empresa.',
      );
    }
  };

  const formatarCnpj = (valor: string) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 14);

    return numeros
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f7f9fc',
        minHeight: '90vh',
        p: { xs: 2, md: 4, lg:6 },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="#172b4d">
            Empresas
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Gerencie as empresas cadastradas no Easy Manager.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={abrirCadastro}
          sx={{
            textTransform: 'none',
            borderRadius: 5,
            px: 2.5,
            py: 1.2,
            backgroundColor: '#2563eb',
          }}
        >
          Nova empresa
        </Button>
      </Stack>

      <Paper
        sx={{
          p: 2.5,
          borderRadius: 5,
          mb: 3,
          border: '1px solid #e8edf5',
          boxShadow: 'none',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#dbeafe',
              color: '#2563eb',
            }}
          >
            <Building2 size={23} />
          </Avatar>

          <Box>
            <Typography color="text.secondary" variant="body2">
              Total de empresas cadastradas
            </Typography>

            <Typography variant="h4" fontWeight={700} color="#172b4d">
              {empresas.length}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper
        sx={{
          p: 2,
          borderRadius: 5,
          border: '1px solid #e8edf5',
          boxShadow: 'none',
          mb: 3,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar empresa por nome ou CNPJ..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#64748b" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {erro && !dialogAberto && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErro('')}>
          {erro}
        </Alert>
      )}

      {empresasFiltradas.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 5,
            border: '1px solid #e8edf5',
            boxShadow: 'none',
          }}
        >
          <Landmark size={42} color="#94a3b8" />

          <Typography fontWeight={700} mt={2}>
            {busca
              ? 'Nenhuma empresa encontrada'
              : 'Nenhuma empresa cadastrada'}
          </Typography>

          <Typography color="text.secondary" variant="body2" mt={0.5}>
            {busca
              ? 'Tente pesquisar usando outro nome ou CNPJ.'
              : 'Cadastre sua primeira empresa para começar.'}
          </Typography>

          {!busca && (
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={abrirCadastro}
              sx={{ mt: 2, textTransform: 'none' }}
            >
              Cadastrar empresa
            </Button>
          )}
        </Paper>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(3, minmax(0, 1fr))',
          }}
          gap={2.5}
        >
          {empresasFiltradas.map((empresa) => (
            <Paper
              key={empresa.id}
              sx={{
                p: 2.5,
                borderRadius: 5,
                border: '1px solid #e8edf5',
                boxShadow: 'none',
                transition: '0.2s',
                '&:hover': {
                  borderColor: '#bfdbfe',
                  boxShadow: '0 5px 20px rgba(15, 23, 42, 0.06)',
                },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: '#eff6ff',
                    color: '#2563eb',
                    borderRadius: 5,
                  }}
                >
                  <Building2 size={23} />
                </Avatar>

                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => abrirEdicao(empresa)}
                    aria-label="Editar empresa"
                  >
                    <Pencil size={17} />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => excluirEmpresa(empresa.id)}
                    aria-label="Excluir empresa"
                  >
                    <Trash2 size={17} />
                  </IconButton>
                </Stack>
              </Stack>

              <Typography
                variant="h6"
                fontWeight={700}
                color="#172b4d"
                mt={2}
                sx={{ overflowWrap: 'anywhere' }}
              >
                {empresa.nome}
              </Typography>

              <Typography variant="body2" color="text.secondary" mt={0.5}>
                CNPJ: {empresa.cnpj || 'Não informado'}
              </Typography>

              <Chip
                label={`Código #${empresa.id}`}
                size="small"
                sx={{
                  mt: 2,
                  bgcolor: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 600,
                }}
              />

              <Button
                fullWidth
                variant="outlined"
                endIcon={<ArrowRight size={17} />}
                onClick={() => navigate(`/empresa/${empresa.id}`)}
                sx={{
                  mt: 2.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Acessar empresa
              </Button>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog
        open={dialogAberto}
        onClose={() => !carregando && setDialogAberto(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={salvarEmpresa}>
          <DialogTitle>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight={700}>
                {empresaEditando ? 'Editar empresa' : 'Cadastrar empresa'}
              </Typography>

              <IconButton
                onClick={() => setDialogAberto(false)}
                disabled={carregando}
              >
                <X size={20} />
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2.5} pt={1}>
              <TextField
                label="Nome da empresa"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
                fullWidth
                autoFocus
              />

              <TextField
                label="CNPJ"
                value={cnpj}
                onChange={(event) =>
                  setCnpj(formatarCnpj(event.target.value))
                }
                placeholder="00.000.000/0000-00"
                fullWidth
                inputProps={{ maxLength: 18 }}
              />

              {erro && <Alert severity="error">{erro}</Alert>}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setDialogAberto(false)}
              color="inherit"
              disabled={carregando}
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
              {carregando ? 'Salvando...' : 'Salvar empresa'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Alert
        severity="success"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: mensagem ? 'flex' : 'none',
          zIndex: 1500,
        }}
        onClose={() => setMensagem('')}
      >
        {mensagem}
      </Alert>
    </Box>
  );
}
