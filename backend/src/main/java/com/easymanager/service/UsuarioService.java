package com.easymanager.service;

import com.easymanager.model.Usuario;
import com.easymanager.repository.UsuarioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class UsuarioService {
    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) { this.repository = repository; }

    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() { return repository.findAll(); }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado: " + id));
    }

    public Usuario cadastrar(Usuario usuario) {
        usuario.setId(null);
        if (usuario.getAtivo() == null) usuario.setAtivo(true);
        return repository.save(usuario);
    }

    public Usuario atualizar(Long id, Usuario dados) {
        Usuario atual = buscarPorId(id);
        atual.setNome(dados.getNome());
        atual.setEmail(dados.getEmail());
        atual.setTelefone(dados.getTelefone());
        if (dados.getSenha() != null && !dados.getSenha().isBlank())
            atual.setSenha(dados.getSenha());
        return repository.save(atual);
    }

    public Usuario alterarStatus(Long id, Boolean ativo) {
        Usuario atual = buscarPorId(id);
        atual.setAtivo(ativo);
        return repository.save(atual);
    }

    public void excluir(Long id) { repository.delete(buscarPorId(id)); }

    @Transactional(readOnly = true)
    public Usuario autenticar(String email, String senha) {

        Usuario usuario = repository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() ->
                    new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "E-mail ou senha inválidos."
                    )
                );

        if (!Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Usuário inativo."
            );
        }

        if (!usuario.getSenha().equals(senha)) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "E-mail ou senha inválidos."
            );
        }

        return usuario;
    }
}
