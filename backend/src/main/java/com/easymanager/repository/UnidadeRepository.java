package com.easymanager.repository;
import com.easymanager.model.Unidade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UnidadeRepository extends JpaRepository<Unidade,Long>{
    }
