package com.easymanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.easymanager.model.Unidade;

public interface UnidadeRepository extends JpaRepository<Unidade, Long> {

    List<Unidade> findByEmpresaId(Long empresaId);
}