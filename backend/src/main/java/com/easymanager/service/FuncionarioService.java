
package com.easymanager.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.easymanager.model.Funcionario;
import com.easymanager.repository.EmpresaRepository;
import com.easymanager.repository.FuncionarioRepository;

@Service
@Transactional
public class FuncionarioService {

    private final FuncionarioRepository repository;
    private final EmpresaRepository empresaRepository;

    public FuncionarioService(FuncionarioRepository repository,
                              EmpresaRepository empresaRepository) {
        this.repository = repository;
        this.empresaRepository = empresaRepository;
    }

    @Transactional(readOnly = true)
    public List<Funcionario> listarTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Funcionario> listarPorEmpresa(Long empresaId) {
        empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException(
                        "Empresa não encontrada: " + empresaId));

        return repository.findByEmpresaId(empresaId);
    }

    @Transactional(readOnly = true)
    public Funcionario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Funcionário não encontrado: " + id));
    }

    public Funcionario cadastrar(Funcionario funcionario) {
        if (funcionario.getEmpresa() == null ||
            funcionario.getEmpresa().getId() == null) {
            throw new RuntimeException("Informe o id da empresa do funcionário.");
        }

        var empresa = empresaRepository.findById(
                funcionario.getEmpresa().getId())
                .orElseThrow(() -> new RuntimeException(
                        "Empresa não encontrada."));

        funcionario.setId(null);
        funcionario.setEmpresa(empresa);

        if (funcionario.getAtivo() == null) {
            funcionario.setAtivo(true);
        }

        return repository.save(funcionario);
    }

    public Funcionario atualizar(Long id, Funcionario dados) {
        Funcionario atual = buscarPorId(id);

        atual.setNome(dados.getNome());
        atual.setCargo(dados.getCargo());
        atual.setEmail(dados.getEmail());
        atual.setTelefone(dados.getTelefone());

        if (dados.getEmpresa() != null &&
            dados.getEmpresa().getId() != null) {

            var empresa = empresaRepository.findById(
                    dados.getEmpresa().getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Empresa não encontrada."));

            atual.setEmpresa(empresa);
        }

        return repository.save(atual);
    }

    public Funcionario alterarStatus(Long id, Boolean ativo) {
        Funcionario atual = buscarPorId(id);
        atual.setAtivo(ativo);
        return repository.save(atual);
    }

    public void excluir(Long id) {
        Funcionario funcionario = buscarPorId(id);
        repository.delete(funcionario);
    }
}
