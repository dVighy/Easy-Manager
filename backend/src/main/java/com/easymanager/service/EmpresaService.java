package com.easymanager.service;

import com.easymanager.model.Empresa;
import com.easymanager.repository.EmpresaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class EmpresaService {
    private final EmpresaRepository repository;

    public EmpresaService(EmpresaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Empresa> listarTodas() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Empresa buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa não encontrada: " + id));
    }

    public Empresa cadastrar(Empresa empresa) {
        empresa.setId(null);
        return repository.save(empresa);
    }

    public Empresa atualizar(Long id, Empresa dados) {
        Empresa atual = buscarPorId(id);
        atual.setNome(dados.getNome());
        atual.setCnpj(dados.getCnpj());
        return repository.save(atual);
    }

    public void excluir(Long id) {
        Empresa empresa = buscarPorId(id);
        repository.delete(empresa);
    }
}
