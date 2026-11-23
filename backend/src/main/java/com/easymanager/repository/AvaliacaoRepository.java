package com.easymanager.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.easymanager.model.Avaliacao;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao,Long>{
     List<Avaliacao> findByEmpresaId(Long empresaId); 
    }
