package com.easymanager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.easymanager.model.UsuarioEmpresa;

public interface UsuarioEmpresaRepository extends JpaRepository<UsuarioEmpresa, Long> {

    Optional<UsuarioEmpresa> findByUsuario_IdAndEmpresa_Id( Long usuarioId, Long empresaId);
}
