package com.easymanager.service;

import com.easymanager.model.Empresa;
import com.easymanager.model.Unidade;
import com.easymanager.repository.EmpresaRepository;
import com.easymanager.repository.UnidadeRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UnidadeService {

    private final UnidadeRepository unidadeRepository;
    private final EmpresaRepository empresaRepository;

    public UnidadeService(
            UnidadeRepository unidadeRepository,
            EmpresaRepository empresaRepository) {
        this.unidadeRepository = unidadeRepository;
        this.empresaRepository = empresaRepository;
    }

    public List<Unidade> listarTodas() {
        return unidadeRepository.findAll();
    }

    public List<Unidade> listarPorEmpresa(Long empresaId) {
        if (!empresaRepository.existsById(empresaId)) {
            throw new RuntimeException("Empresa não encontrada.");
        }

        return unidadeRepository.findByEmpresaId(empresaId);
    }

    public Unidade buscarPorId(Long id) {
        return unidadeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Unidade não encontrada."));
    }

    public Unidade cadastrar(Unidade unidade) {
        if (unidade.getEmpresa() == null ||
                unidade.getEmpresa().getId() == null) {
            throw new RuntimeException("Empresa obrigatória.");
        }

        Empresa empresa = empresaRepository.findById(
                unidade.getEmpresa().getId()
        ).orElseThrow(() ->
                new RuntimeException("Empresa não encontrada."));

        unidade.setEmpresa(empresa);
        unidade.setId(null);

        if (unidade.getAtivo() == null) {
            unidade.setAtivo(true);
        }

        return unidadeRepository.save(unidade);
    }

    public Unidade atualizar(Long id, Unidade dados) {
        Unidade unidade = buscarPorId(id);

        unidade.setNome(dados.getNome());
        unidade.setEndereco(dados.getEndereco());
        unidade.setTelefone(dados.getTelefone());

        if (dados.getAtivo() != null) {
            unidade.setAtivo(dados.getAtivo());
        }

        if (dados.getEmpresa() != null &&
                dados.getEmpresa().getId() != null) {

            Empresa empresa = empresaRepository.findById(
                    dados.getEmpresa().getId()
            ).orElseThrow(() ->
                    new RuntimeException("Empresa não encontrada."));

            unidade.setEmpresa(empresa);
        }

        return unidadeRepository.save(unidade);
    }

    public void excluir(Long id) {
        Unidade unidade = buscarPorId(id);
        unidadeRepository.delete(unidade);
    }
}