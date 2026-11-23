package com.easymanager.config;
import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.easymanager.model.Avaliacao;
import com.easymanager.model.Empresa;
import com.easymanager.model.Funcionario;
import com.easymanager.repository.AvaliacaoRepository;
import com.easymanager.repository.EmpresaRepository;
import com.easymanager.repository.FuncionarioRepository;
@Configuration
public class DataInitializer {
    @Bean CommandLineRunner seed(EmpresaRepository empresa,FuncionarioRepository funcionario,AvaliacaoRepository avaliacao){
    return args->{if(empresa.count()==0){
    Empresa e = empresa.save(new Empresa("EstacionaFácil",""));
    Funcionario f = new Funcionario();
    f.setNome("Carlos Oliveira");
    f.setCargo("Operador de estacionamento");
    f.setEmail("carlos@estacionafacil.com");
    f.setTelefone("(12) 99999-1001");
    f.setEmpresa(e);
    f.setAtivo(true);
    funcionario.save(f);
    
    Avaliacao a = new Avaliacao();
    a.setCliente(null);
    a.setComentario("Excelente atendimento e organização.");
    a.setNota(5);
    a.setSentimento("Positivo");
    a.setData(LocalDateTime.now());
    a.setEmpresa(e);
    a.setUnidade(null);
    avaliacao.save(a);
  }};
 }
}
