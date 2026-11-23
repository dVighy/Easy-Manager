import { useEffect, useState, type FormEvent } from 'react';

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Snackbar,
  TextField,
} from '@mui/material';

interface Cliente {
  id: number;
  nome: string;
}

interface Unidade {
  id: number;
  nome: string;
  ativo: boolean;
}

interface Props {
  open: boolean;
  empresaId: number;
  onClose: () => void;
  onSaved: () => void;
}

const API_AVALIACOES = 'http://localhost:8080/api/avaliacoes';
const API_CLIENTES = 'http://localhost:8080/api/clientes';
const API_UNIDADES = 'http://localhost:8080/api/unidades';

export default function CadastroAvaliacaoDialog({
  open,
  empresaId,
  onClose,
  onSaved,
}: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  const [clienteId, setClienteId] = useState('');
  const [unidadeId, setUnidadeId] = useState('');
  const [nota, setNota] = useState('5');
  const [comentario, setComentario] = useState('');
  const [sentimento, setSentimento] = useState('Positivo');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (!open) return;

    async function carregarDados() {
      setLoading(true);
      setErro('');

      try {
        const [resClientes, resUnidades] = await Promise.all([
          fetch(`${API_CLIENTES}/empresa/${empresaId}`),
          fetch(`${API_UNIDADES}/empresa/${empresaId}`),
        ]);

        if (!resClientes.ok || !resUnidades.ok) {
          throw new Error('Não foi possível carregar clientes e unidades.');
        }

        const dadosClientes: Cliente[] = await resClientes.json();
        const dadosUnidades: Unidade[] = await resUnidades.json();

        setClientes(dadosClientes);
        setUnidades(dadosUnidades.filter((u) => u.ativo));

        setClienteId('');
        setUnidadeId('');
        setNota('5');
        setComentario('');
        setSentimento('Positivo');
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar dados.',
        );
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [open, empresaId]);

  async function salvar(event: FormEvent) {
    event.preventDefault();

    if (!clienteId || !unidadeId || !nota) {
      setErro('Preencha cliente, unidade e nota.');
      return;
    }

    try {
      const payload = {
        nota: Number(nota),
        comentario: comentario.trim(),
        sentimento,
        empresa: { id: empresaId },
        cliente: { id: Number(clienteId) },
        unidade: { id: Number(unidadeId) },
      };

      const response = await fetch(API_AVALIACOES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const texto = await response.text();
        throw new Error(texto || 'Erro ao cadastrar avaliação.');
      }

      setMensagem('Avaliação cadastrada!');
      onSaved();
      onClose();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Erro ao cadastrar avaliação.',
      );
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Nova avaliação</DialogTitle>

        <Divider />

        <form onSubmit={salvar}>
          <DialogContent>
            {erro && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {erro}
              </Alert>
            )}

            {loading ? (
              <Alert severity="info">
                Carregando clientes e unidades...
              </Alert>
            ) : (
              <>
                <TextField
                  label="Cliente"
                  select
                  fullWidth
                  required
                  margin="normal"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                >
                  {clientes.map((cliente) => (
                    <MenuItem
                      key={cliente.id}
                      value={String(cliente.id)}
                    >
                      {cliente.nome}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Unidade"
                  select
                  fullWidth
                  required
                  margin="normal"
                  value={unidadeId}
                  onChange={(e) => setUnidadeId(e.target.value)}
                >
                  {unidades.map((unidade) => (
                    <MenuItem
                      key={unidade.id}
                      value={String(unidade.id)}
                    >
                      {unidade.nome}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Nota"
                  select
                  fullWidth
                  required
                  margin="normal"
                  value={nota}
                  onChange={(e) => {
                    const valor = e.target.value;
                    setNota(valor);

                    setSentimento(
                      Number(valor) >= 4
                        ? 'Positivo'
                        : Number(valor) === 3
                          ? 'Neutro'
                          : 'Negativo',
                    );
                  }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <MenuItem key={n} value={String(n)}>
                      {n} {n === 1 ? 'estrela' : 'estrelas'}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Comentário"
                  fullWidth
                  multiline
                  minRows={4}
                  margin="normal"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />

                <TextField
                  label="Sentimento"
                  select
                  fullWidth
                  margin="normal"
                  value={sentimento}
                  onChange={(e) => setSentimento(e.target.value)}
                >
                  <MenuItem value="Positivo">Positivo</MenuItem>
                  <MenuItem value="Neutro">Neutro</MenuItem>
                  <MenuItem value="Negativo">Negativo</MenuItem>
                </TextField>
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onClose} color="inherit">
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
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
              Cadastrar avaliação
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={!!mensagem}
        autoHideDuration={3000}
        onClose={() => setMensagem('')}
      >
        <Alert severity="success">{mensagem}</Alert>
      </Snackbar>
    </>
  );
}