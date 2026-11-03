
import { useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';

import {
  PersonOutline,
  EmailOutlined,
  PhoneOutlined,
  WorkOutline,
  BusinessOutlined,
  EditOutlined,
  SaveOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  AccountCircleOutlined,
} from '@mui/icons-material';

export default function Perfil() {
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [dados, setDados] = useState({
    nome: 'Usuário Easy Manager',
    email: 'usuario@exemplo.com',
    telefone: '(12) 99999-9999',
    cargo: 'Administrador',
    departamento: 'Gestão',
  });

  const [senha, setSenha] = useState({
    atual: '',
    nova: '',
    confirmar: '',
  });

  const atualizarCampo = (campo: string, valor: string) => {
    setDados((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const salvarDados = () => {
    setEditando(false);
    setMensagem('Dados atualizados nesta demonstração.');
  };

  const alterarSenha = () => {
    if (!senha.atual || !senha.nova || !senha.confirmar) {
      setMensagem('Preencha todos os campos de senha.');
      return;
    }

    if (senha.nova !== senha.confirmar) {
      setMensagem('A nova senha e a confirmação não coincidem.');
      return;
    }

    setMensagem('Alteração demonstrativa. A senha ainda não foi modificada no servidor.');
    setSenha({ atual: '', nova: '', confirmar: '' });
  };

  const campo = (
    label: string,
    valor: string,
    icone: React.ReactNode,
    onChange?: (valor: string) => void,
  ) => (
    <TextField
      fullWidth
      label={label}
      value={valor}
      disabled={!editando || !onChange}
      onChange={(e) => onChange?.(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {icone}
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: editando ? '#FFFFFF' : '#F8FAFC',
        },
      }}
    />
  );

  return (
    <Box sx={{ width: '100%', pb: 4, p:3 }}>
      {/* Cabeçalho */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#aaaadf"
            textAlign= 'left'
            paddingTop={2}
            paddingLeft={2}
          >
            Meu Perfil
          </Typography>

          <Typography color="text.secondary" paddingLeft={2} sx={{ mt: 0.5 }}>
            Gerencie suas informações pessoais e configurações da conta.
          </Typography>
        </Box>

        {!editando ? (
          <Button
            variant="contained"
            startIcon={<EditOutlined />}
            onClick={() => {
              setEditando(true);
              setMensagem('');
            }}
            sx={{
              backgroundColor: '#1E1E2F',
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              '&:hover': { backgroundColor: '#303047' },
            }}
          >
            Editar perfil
          </Button>
        ) : (
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              onClick={() => setEditando(false)}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveOutlined />}
              onClick={salvarDados}
              sx={{
                backgroundColor: '#1E1E2F',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': { backgroundColor: '#303047' },
              }}
            >
              Salvar alterações
            </Button>
          </Box>
        )}
      </Box>

      {mensagem && (
        <Alert
          severity={
            mensagem.includes('não coincidem') ||
            mensagem.includes('Preencha')
              ? 'warning'
              : 'success'
          }
          onClose={() => setMensagem('')}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {mensagem}
        </Alert>
      )}

      <Grid container spacing={3} padding={2} paddingTop={0} gap={2}>
        {/* Identificação do usuário */}
        <Grid size={{ xs: 12, md: 4}}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              textAlign: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                backgroundColor: '#1E1E2F',
                fontSize: 38,
              }}
            >
              <AccountCircleOutlined fontSize="inherit" />
            </Avatar>

            <Typography variant="h6" fontWeight={700} color="#1E1E2F">
              {dados.nome}
            </Typography>

            <Typography color="text.secondary" variant="body2">
              {dados.email}
            </Typography>

            <Chip
              label={dados.cargo}
              size="small"
              sx={{
                mt: 2,
                backgroundColor: '#E9EDFA',
                color: '#1E1E2F',
                fontWeight: 600,
              }}
            />

            <Divider sx={{ my: 3 }} />

            <Box textAlign="left" display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <WorkOutline sx={{ color: '#64748B' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cargo
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {dados.cargo}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1.5}>
                <BusinessOutlined sx={{ color: '#64748B' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Departamento
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {dados.departamento}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Informações pessoais */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <PersonOutline sx={{ color: '#1E1E2F' }} />
              <Typography variant="h6" fontWeight={700} color="#1E1E2F">
                Informações pessoais
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                {campo(
                  'Nome completo',
                  dados.nome,
                  <PersonOutline />,
                  (v) => atualizarCampo('nome', v),
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                {campo(
                  'E-mail',
                  dados.email,
                  <EmailOutlined />,
                  (v) => atualizarCampo('email', v),
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                {campo(
                  'Telefone',
                  dados.telefone,
                  <PhoneOutlined />,
                  (v) => atualizarCampo('telefone', v),
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {campo(
                  'Cargo',
                  dados.cargo,
                  <WorkOutline />,
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {campo(
                  'Departamento',
                  dados.departamento,
                  <BusinessOutlined />,
                )}
              </Grid>
            </Grid>

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mt: 2 }}
            >
              Cargo e departamento são informações administradas pelo sistema.
            </Typography>
          </Paper>

          {/* Segurança */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mt: 3,
              borderRadius: 3,
              border: '1px solid #E2E8F0',
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LockOutlined sx={{ color: '#1E1E2F' }} />
              <Typography variant="h6" fontWeight={700} color="#1E1E2F">
                Segurança da conta
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" mb={3}>
              Gerencie sua senha de acesso à plataforma.
            </Typography>

            <Grid container spacing={2}>
              {[
                { label: 'Senha atual', key: 'atual' },
                { label: 'Nova senha', key: 'nova' },
                { label: 'Confirmar nova senha', key: 'confirmar' },
              ].map((item) => (
                <Grid size={{ xs: 12 }} key={item.key}>
                  <TextField
                    fullWidth
                    label={item.label}
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha[item.key as keyof typeof senha]}
                    onChange={(e) =>
                      setSenha((anterior) => ({
                        ...anterior,
                        [item.key]: e.target.value,
                      }))
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            edge="end"
                            aria-label="Mostrar ou ocultar senha"
                          >
                            {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Button
              variant="outlined"
              onClick={alterarSenha}
              sx={{
                mt: 3,
                color: '#1E1E2F',
                borderColor: '#1E1E2F',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#303047',
                  backgroundColor: '#F1F7FF',
                },
              }}
            >
              Atualizar senha
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mt: 2 }}
            >
              A alteração de senha será habilitada após a integração com o backend.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
