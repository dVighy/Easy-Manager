package com.easymanager.service;

import com.easymanager.model.Avaliacao;
import com.easymanager.repository.AvaliacaoRepository;
import com.easymanager.repository.EmpresaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class AvaliacaoService {
    private final AvaliacaoRepository repository;
    private final EmpresaRepository empresaRepository;

    public AvaliacaoService(AvaliacaoRepository repository, EmpresaRepository empresaRepository) {
        this.repository = repository;
        this.empresaRepository = empresaRepository;
    }

    @Transactional(readOnly = true)
    public List<Avaliacao> listarTodas() { return repository.findAll(); }

    @Transactional(readOnly = true)
    public List<Avaliacao> listarPorEmpresa(Long empresaId) {
        empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa não encontrada: " + empresaId));
        return repository.findAll().stream()
                .filter(a -> a.getEmpresa() != null && empresaId.equals(a.getEmpresa().getId()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Avaliacao> listarPorEmpresaENota(Long empresaId, Integer min, Integer max) {
        if (min == null || max == null || min < 1 || max > 5 || min > max)
            throw new RegraNegocioException("Informe notas válidas entre 1 e 5, com mínimo menor ou igual ao máximo.");
        return listarPorEmpresa(empresaId).stream()
                .filter(a -> a.getNota() != null && a.getNota() >= min && a.getNota() <= max)
                .toList();
    }

    @Transactional(readOnly = true)
    public Avaliacao buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Avaliação não encontrada: " + id));
    }

    public Avaliacao cadastrar(Avaliacao avaliacao) {
        if (avaliacao.getEmpresa() == null || avaliacao.getEmpresa().getId() == null)
            throw new RegraNegocioException("Informe o id da empresa da avaliação.");
        if (avaliacao.getNota() == null || avaliacao.getNota() < 1 || avaliacao.getNota() > 5)
            throw new RegraNegocioException("A nota deve estar entre 1 e 5.");
        var empresa = empresaRepository.findById(avaliacao.getEmpresa().getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa não encontrada."));
        avaliacao.setId(null);
        avaliacao.setEmpresa(empresa);
        return repository.save(avaliacao);
    }

    public Avaliacao atualizar(Long id, Avaliacao dados) {
        Avaliacao atual = buscarPorId(id);
        if (dados.getNota() != null && (dados.getNota() < 1 || dados.getNota() > 5))
            throw new RegraNegocioException("A nota deve estar entre 1 e 5.");
        atual.setNota(dados.getNota());
        atual.setComentario(dados.getComentario());
        atual.setSentimento(dados.getSentimento());
        if (dados.getEmpresa() != null && dados.getEmpresa().getId() != null) {
            var empresa = empresaRepository.findById(dados.getEmpresa().getId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa não encontrada."));
            atual.setEmpresa(empresa);
        }
        return repository.save(atual);
    }

    public void excluir(Long id) { repository.delete(buscarPorId(id)); }
}
