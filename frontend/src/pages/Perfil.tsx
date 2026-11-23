
import { useEffect, useState, type ReactNode } from 'react';

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
  Alert,
  CircularProgress,
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
  AccountCircleOutlined,
  ShieldOutlined,
  CheckCircleOutline,
  ArrowRightAlt,
} from '@mui/icons-material';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  ativo: boolean;
}

export default function Perfil() {
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'success' | 'error' | 'warning'>('success');

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const [dados, setDados] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  const [dadosOriginais, setDadosOriginais] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        const usuarioSalvo = sessionStorage.getItem('easyManagerUsuario');

        if (!usuarioSalvo) {
          throw new Error('Usuário não encontrado. Faça login novamente.');
        }

        const usuarioSessao: Usuario = JSON.parse(usuarioSalvo);

        const resposta = await fetch(
          `http://localhost:8080/api/usuarios/${usuarioSessao.id}`
        );

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar os dados do usuário.');
        }

        const usuarioAPI: Usuario = await resposta.json();

        setUsuario(usuarioAPI);

        const dadosUsuario = {
          nome: usuarioAPI.nome ?? '',
          email: usuarioAPI.email ?? '',
          telefone: usuarioAPI.telefone ?? '',
        };

        setDados(dadosUsuario);
        setDadosOriginais(dadosUsuario);

        sessionStorage.setItem(
          'easyManagerUsuario',
          JSON.stringify(usuarioAPI)
        );
      } catch (error) {
        setTipoMensagem('error');
        setMensagem(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar o perfil.'
        );
      } finally {
        setCarregando(false);
      }
    };

    buscarUsuario();
  }, []);

  const atualizarCampo = (campo: string, valor: string) => {
    setDados((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const cancelarEdicao = () => {
    setDados(dadosOriginais);
    setEditando(false);
    setMensagem('');
  };

  const salvarDados = async () => {
    if (!usuario) {
      setTipoMensagem('error');
      setMensagem('Não foi possível identificar o usuário.');
      return;
    }

    if (!dados.nome.trim() || !dados.email.trim()) {
      setTipoMensagem('warning');
      setMensagem('Nome e e-mail são obrigatórios.');
      return;
    }

    try {
      setSalvando(true);
      setMensagem('');

      const resposta = await fetch(
        `http://localhost:8080/api/usuarios/${usuario.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: usuario.id,
            nome: dados.nome.trim(),
            email: dados.email.trim(),
            telefone: dados.telefone.trim(),
            ativo: usuario.ativo,
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error('Não foi possível atualizar os dados do perfil.');
      }

      const usuarioAtualizado: Usuario = await resposta.json();

      setUsuario(usuarioAtualizado);

      const novosDados = {
        nome: usuarioAtualizado.nome ?? '',
        email: usuarioAtualizado.email ?? '',
        telefone: usuarioAtualizado.telefone ?? '',
      };

      setDados(novosDados);
      setDadosOriginais(novosDados);

      sessionStorage.setItem(
        'easyManagerUsuario',
        JSON.stringify(usuarioAtualizado)
      );

      setEditando(false);
      setTipoMensagem('success');
      setMensagem('Seus dados foram atualizados com sucesso!');
    } catch (error) {
      setTipoMensagem('error');
      setMensagem(
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar os dados.'
      );
    } finally {
      setSalvando(false);
    }
  };

  const campo = (
    label: string,
    valor: string,
    icone: ReactNode,
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
            <Box color="#8492A6" display="flex">
              {icone}
            </Box>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2.5,
          backgroundColor: editando && onChange ? '#FFFFFF' : '#F8FAFC',
          fontSize: 14,
          '& fieldset': {
            borderColor: '#E8EDF4',
          },
          '&:hover fieldset': {
            borderColor: '#B8C9E0',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#527DB5',
          },
        },
        '& .MuiInputLabel-root': {
          fontSize: 13,
        },
      }}
    />
  );

  if (carregando) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        bgcolor: '#F6F8FC',
        p: { xs: 2, md: 3.5 },
        borderRadius: 3,
      }}
    >
      {/* Cabeçalho */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
        mb={3}
      >
        <Box>
          <Typography
            fontSize={13}
            fontWeight={600}
            color="#8290A5"
            mb={0.8}
          >
            CONTA / PERFIL
          </Typography>

          <Typography
            variant="h4"
            fontWeight={750}
            color="#202B3C"
            letterSpacing="-1px"
          >
            Meu perfil
          </Typography>

          <Typography color="#8492A6" fontSize={14} mt={0.7}>
            Gerencie suas informações pessoais e sua conta.
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
              bgcolor: '#253B59',
              borderRadius: 2.5,
              px: 2.5,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 3px 10px rgba(37,59,89,0.12)',
              '&:hover': { bgcolor: '#344F73' },
            }}
          >
            Editar perfil
          </Button>
        ) : (
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              onClick={cancelarEdicao}
              disabled={salvando}
              sx={{
                borderRadius: 2.5,
                textTransform: 'none',
                borderColor: '#DCE3EC',
                color: '#64748B',
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveOutlined />}
              onClick={salvarDados}
              disabled={salvando}
              sx={{
                bgcolor: '#253B59',
                borderRadius: 2.5,
                px: 2.5,
                textTransform: 'none',
                '&:hover': { bgcolor: '#344F73' },
              }}
            >
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </Box>
        )}
      </Box>

      {mensagem && (
        <Alert
          severity={tipoMensagem}
          onClose={() => setMensagem('')}
          sx={{ mb: 3, borderRadius: 2.5 }}
        >
          {mensagem}
        </Alert>
      )}

      {/* Identificação */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 3,
          border: '1px solid #E8EDF4',
          mb: 3,
          background: 'linear-gradient(110deg, #FFFFFF 55%, #F0F5FC 100%)',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={2.5}
        >
          <Box position="relative">
            <Avatar
              sx={{
                width: 86,
                height: 86,
                bgcolor: '#E7EEF8',
                color: '#385D8C',
                border: '4px solid #FFFFFF',
                boxShadow: '0 3px 12px rgba(40,65,100,0.10)',
              }}
            >
              <AccountCircleOutlined sx={{ fontSize: 55 }} />
            </Avatar>

            <Box
              sx={{
                position: 'absolute',
                bottom: 3,
                right: 3,
                width: 17,
                height: 17,
                borderRadius: '50%',
                bgcolor: usuario?.ativo ? '#2DA77A' : '#94A3B8',
                border: '3px solid white',
              }}
            />
          </Box>

          <Box flex={1} minWidth={180}>
            <Typography
              fontSize={22}
              fontWeight={750}
              color="#26364B"
              letterSpacing="-0.4px"
            >
              {dados.nome}
            </Typography>

            <Typography color="#8492A6" fontSize={14} mt={0.4}>
              {dados.email}
            </Typography>

            <Box display="flex" gap={1} mt={1.5} flexWrap="wrap">
              <Chip
                size="small"
                icon={<CheckCircleOutline sx={{ fontSize: '15px !important' }} />}
                label={usuario?.ativo ? 'Conta ativa' : 'Conta inativa'}
                sx={{
                  bgcolor: usuario?.ativo ? '#E9F7F0' : '#F1F3F6',
                  color: usuario?.ativo ? '#24835F' : '#64748B',
                  fontWeight: 600,
                  fontSize: 11,
                  '& .MuiChip-icon': {
                    color: 'inherit',
                  },
                }}
              />

              <Chip
                size="small"
                label={`ID #${usuario?.id ?? '-'}`}
                sx={{
                  bgcolor: '#EDF2F8',
                  color: '#64748B',
                  fontWeight: 600,
                  fontSize: 11,
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
              color: '#8290A5',
            }}
          >
            <ShieldOutlined sx={{ fontSize: 20 }} />
            <Typography fontSize={12} fontWeight={500}>
              Informações da conta
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Conteúdo */}
      <Grid container spacing={3}>
        {/* Informações pessoais */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              height: '100%',
              borderRadius: 3,
              border: '1px solid #E8EDF4',
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5} mb={0.7}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: '#EDF3FB',
                  color: '#527DB5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonOutline />
              </Box>

              <Box>
                <Typography fontWeight={700} color="#26364B">
                  Informações pessoais
                </Typography>
                <Typography fontSize={12} color="#94A0B1">
                  Seus dados de identificação
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2.5, borderColor: '#EDF0F5' }} />

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                {campo(
                  'Nome completo',
                  dados.nome,
                  <PersonOutline fontSize="small" />,
                  (v) => atualizarCampo('nome', v),
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                {campo(
                  'E-mail',
                  dados.email,
                  <EmailOutlined fontSize="small" />,
                  (v) => atualizarCampo('email', v),
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                {campo(
                  'Telefone',
                  dados.telefone,
                  <PhoneOutlined fontSize="small" />,
                  (v) => atualizarCampo('telefone', v),
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {campo(
                  'Cargo',
                  'Não informado',
                  <WorkOutline fontSize="small" />,
                )}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {campo(
                  'Departamento',
                  'Não informado',
                  <BusinessOutlined fontSize="small" />,
                )}
              </Grid>
            </Grid>

            <Box
              mt={2.5}
              p={1.8}
              borderRadius={2}
              bgcolor="#F7F9FC"
              display="flex"
              alignItems="flex-start"
              gap={1}
            >
              <ShieldOutlined sx={{ color: '#8297B3', fontSize: 18, mt: 0.2 }} />
              <Typography fontSize={12} color="#8290A5" lineHeight={1.6}>
                Cargo e departamento são administrados pelo sistema e não podem ser alterados nesta tela.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Coluna lateral */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box display="flex" flexDirection="column" gap={3} height="100%">
            {/* Resumo da conta */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #E8EDF4',
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    bgcolor: '#EDF7F2',
                    color: '#319B72',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldOutlined />
                </Box>

                <Box>
                  <Typography fontWeight={700} color="#26364B">
                    Resumo da conta
                  </Typography>
                  <Typography fontSize={12} color="#94A0B1">
                    Situação do seu acesso
                  </Typography>
                </Box>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1.5}
                borderBottom="1px solid #EDF0F5"
              >
                <Typography fontSize={13} color="#8492A6">
                  Status
                </Typography>
                <Typography
                  fontSize={13}
                  fontWeight={600}
                  color={usuario?.ativo ? '#24835F' : '#64748B'}
                >
                  {usuario?.ativo ? 'Ativo' : 'Inativo'}
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1.5}
              >
                <Typography fontSize={13} color="#8492A6">
                  Identificação
                </Typography>
                <Typography fontSize={13} fontWeight={600} color="#26364B">
                  #{usuario?.id ?? '-'}
                </Typography>
              </Box>
            </Paper>

            {/* Segurança */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #E8EDF4',
                flex: 1,
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    bgcolor: '#F4EFFB',
                    color: '#8867B4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LockOutlined />
                </Box>

                <Box>
                  <Typography fontWeight={700} color="#26364B">
                    Segurança
                  </Typography>
                  <Typography fontSize={12} color="#94A0B1">
                    Proteção da sua conta
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2.5, borderColor: '#EDF0F5' }} />

              <Box
                sx={{
                  bgcolor: '#F8F9FC',
                  border: '1px solid #EDF0F5',
                  borderRadius: 2.5,
                  p: 2.5,
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width={45}
                  height={45}
                  borderRadius={2}
                  bgcolor="#EEEAF7"
                  color="#8867B4"
                  mb={1.5}
                >
                  <LockOutlined />
                </Box>

                <Typography fontWeight={650} color="#34445A" fontSize={14}>
                  Alteração de senha
                </Typography>

                <Typography
                  color="#8996A8"
                  fontSize={12}
                  lineHeight={1.7}
                  mt={0.7}
                  mb={2}
                >
                  A funcionalidade de atualização de senha ainda está em desenvolvimento.
                </Typography>

                <Button
                  fullWidth
                  disabled
                  variant="outlined"
                  endIcon={<ArrowRightAlt />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Em breve
                </Button>
              </Box>

              <Box display="flex" gap={1} alignItems="center" mt={2}>
                <CheckCircleOutline sx={{ color: '#319B72', fontSize: 17 }} />
                <Typography fontSize={11} color="#8996A8">
                  Seus dados pessoais são gerenciados pelo sistema.
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Box
        display="flex"
        justifyContent="flex-end"
        mt={3}
      >
        <Typography fontSize={11} color="#A0AABC">
          EASY MANAGER · CONFIGURAÇÕES DA CONTA
        </Typography>
      </Box>
    </Box>
  );
}
