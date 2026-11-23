package com.easymanager.dto;

import com.easymanager.model.Usuario;

public record UsuarioRespostaDTO(
        Long id, String nome, String email, String telefone, Boolean ativo
) {
    public static UsuarioRespostaDTO de(Usuario usuario) {
        return new UsuarioRespostaDTO(usuario.getId(), usuario.getNome(),
                usuario.getEmail(), usuario.getTelefone(), usuario.getAtivo());
    }
}
