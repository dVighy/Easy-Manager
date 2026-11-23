package com.easymanager.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.easymanager.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario,Long>{ 

    List<Funcionario> findByEmpresaId(Long empresaId);

 }
