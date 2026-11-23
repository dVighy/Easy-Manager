package com.easymanager.service;

import com.easymanager.model.Unidade;
import com.easymanager.repository.UnidadeRepository;
import com.easymanager.repository.EmpresaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class UnidadeService {
    private final UnidadeRepository repository;
    private final EmpresaRepository empresaRepository;

    public UnidadeService(UnidadeRepository repository, EmpresaRepository empresaRepository) {
        this.repository = repository;
        this.empresaRepository = empresaRepository;
    }

    @Transactional(readOnly = true)
    public List<Unidade> listarTodas() { return repository.findAll(); }

    @Transactional(readOnly = true)
    public List<Unidade> listarPorEmpresa(Long empresaId) {
        empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa não encontrada: " + empresaId));
        return repository.findAll().stream()
                .filter(u -> u.getEmpresa() != null && empresaId.equals(u.getEmpresa().getId()))
                .toList();
    }

    @Transactional(readOnly = true)
    public Unidade buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Unidade não encontrada: " + id));
    }

    public Unidade cadastrar(Unidade unidade) {
        if (unidade.getEmpresa() == null || unidade.getEmpresa().getId() == null)
            throw new RegraNegocioException("Informe o id da empresa da unidade.");
        var empresa = empresaRepository.findById(unidade.getEmpresa().getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa não encontrada."));
        unidade.setId(null);
        unidade.setEmpresa(empresa);
        if (unidade.getAtivo() == null) unidade.setAtivo(true);
        return repository.save(unidade);
    }

    public Unidade atualizar(Long id, Unidade dados) {
        Unidade atual = buscarPorId(id);
        atual.setNome(dados.getNome());
        atual.setEndereco(dados.getEndereco());
        atual.setTelefone(dados.getTelefone());
        if (dados.getEmpresa() != null && dados.getEmpresa().getId() != null) {
            var empresa = empresaRepository.findById(dados.getEmpresa().getId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa não encontrada."));
            atual.setEmpresa(empresa);
        }
        return repository.save(atual);
    }

    public Unidade alterarStatus(Long id, Boolean ativo) {
        Unidade atual = buscarPorId(id);
        atual.setAtivo(ativo);
        return repository.save(atual);
    }

    public void excluir(Long id) { repository.delete(buscarPorId(id)); }
}
