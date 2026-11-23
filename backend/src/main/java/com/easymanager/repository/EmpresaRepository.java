package com.easymanager.repository;
import com.easymanager.model.Empresa;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaRepository extends JpaRepository<Empresa,Long>{
}
