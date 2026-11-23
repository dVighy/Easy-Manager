package com.easymanager.repository;
import com.easymanager.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao,Long>{
     List<Avaliacao> findByEmpresaId(Long empresaId); 
    }
