
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(() => localStorage.getItem('easyManagerEmail') ?? '');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro('');

    if (!email.trim() || !senha.trim()) {
      setErro('Preencha todos os campos para continuar.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErro('Informe um endereço de e-mail válido.');
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          senha: senha,
        }),
      });

      if (!resposta.ok) {
        const dadosErro = await resposta.json().catch(() => null);

        throw new Error(
          dadosErro?.detail || 'E-mail ou senha inválidos.'
        );
      }

      const usuario = await resposta.json();

      // Mantém os dados do usuário durante a sessão.
      sessionStorage.setItem(
        'easyManagerUsuario',
        JSON.stringify(usuario)
      );

      // Guarda somente o e-mail, nunca a senha.
      if (lembrar) {
        localStorage.setItem('easyManagerEmail', email.trim());
      } else {
        localStorage.removeItem('easyManagerEmail');
      }

      navigate('/');
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível conectar ao servidor.'
      );
    } finally {
      setCarregando(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#F1F7FF',
      }}
    >
      {/* Painel de apresentação */}
      <Box
        sx={{
          width: { xs: '0%', md: '48%' },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center ',
          backgroundColor: '#1E1E2F',
          color: 'white',
          p: { md: 6, lg: 8 },
          position: 'relative',
          overflow: 'hidden',
          
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            top: '25%',
            right: -180,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            bottom: -100,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <DashboardRoundedIcon sx={{ fontSize: 34 }} />

            <Typography
              variant="h5"
              fontWeight={700}
              letterSpacing={0.3}
            >
              Easy Manager
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', alignItems: 'center', justifyContent: 'center', zIndex: 1, maxWidth: 500 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#A9B9E8',
              letterSpacing: 2,
              fontWeight: 600,
            }}
          >
            GESTÃO INTELIGENTE
          </Typography>

          <Typography
            variant="h3"
            fontWeight={700}
            lineHeight={1.2}
            sx={{ mt: 2, mb: 3 }}
          >
            Sua gestão,
            <br />
            mais simples.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#C5C9D8',
              lineHeight: 1.8,
              fontSize: '1.05rem',
              maxWidth: 430,
            }}
          >
            Centralize informações, acompanhe resultados e
            tenha uma visão integrada de todas as suas empresas
            em um só lugar.
          </Typography>

          <Box
            sx={{
              mt: 5,
              p: 3,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <BusinessRoundedIcon
                sx={{ fontSize: 32, color: '#A9B9E8' }}
              />

              <Box>
                <Typography fontWeight={600}>
                  Gestão integrada
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: '#C5C9D8', mt: 0.5 }}
                >
                  Diferentes negócios, uma única plataforma.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: '#9298AD',
            position: 'relative',
            zIndex: 1,
          }}
        >
          © 2026 Easy Manager. Todos os direitos reservados.
        </Typography>
      </Box>

      {/* Área do formulário */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 430 }}>
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 5,
              color: '#1E1E2F',
            }}
          >
            <DashboardRoundedIcon sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700}>
              Easy Manager
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: '#64748B',
                letterSpacing: 1.5,
                fontWeight: 600,
              }}
            >
              BEM-VINDA(O) DE VOLTA
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                color: '#1E1E2F',
                mt: 1,
                mb: 1,
                fontSize: { xs: '1.8rem', sm: '2rem' },
              }}
            >
              Faça seu login
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: '#64748B', mb: 4 }}
            >
              Entre com suas credenciais para acessar sua conta.
            </Typography>

            {erro && (
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {erro}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleLogin}
              noValidate
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ mb: 1, color: '#334155' }}
              >
                E-mail
              </Typography>

              <TextField
                fullWidth
                placeholder="seuemail@exemplo.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErro('');
                }}
                autoComplete="email"
                sx={{
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon
                        sx={{ color: '#94A3B8' }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ mb: 1, color: '#334155' }}
              >
                Senha
              </Typography>

              <TextField
                fullWidth
                placeholder="Digite sua senha"
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setErro('');
                }}
                autoComplete="current-password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon
                        sx={{ color: '#94A3B8' }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setMostrarSenha(!mostrarSenha)
                        }
                        edge="end"
                        aria-label="Mostrar ou ocultar senha"
                      >
                        {mostrarSenha ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: 1,
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={lembrar}
                      onChange={(e) =>
                        setLembrar(e.target.checked)
                      }
                      size="small"
                      sx={{
                        color: '#64748B',
                        '&.Mui-checked': {
                          color: '#1E1E2F',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      color="#64748B"
                    >
                      Lembrar acesso
                    </Typography>
                  }
                />
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={carregando}
                sx={{
                  backgroundColor: '#1E1E2F',
                  color: '#FFFFFF',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#303047',
                    boxShadow: 'none',
                  },
                }}
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </Button>
            </Box>

            <Typography
              variant="caption"
              display="block"
              textAlign="center"
              sx={{ mt: 3, color: '#94A3B8', lineHeight: 1.6 }}
            >
              Não possui acesso? Entre em contato com o
              administrador do sistema.
            </Typography>
          </Paper>

          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            sx={{ mt: 3, color: '#94A3B8' }}
          >
            Plataforma de gestão empresarial
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
