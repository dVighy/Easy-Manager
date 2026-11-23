
package com.easymanager.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.easymanager.model.Avaliacao;
import com.easymanager.repository.AvaliacaoRepository;
import com.easymanager.repository.ClienteRepository;
import com.easymanager.repository.EmpresaRepository;
import com.easymanager.repository.UnidadeRepository;

@Service
@Transactional
public class AvaliacaoService {

    private final AvaliacaoRepository repository;
    private final EmpresaRepository empresaRepository;
    private final ClienteRepository clienteRepository;
    private final UnidadeRepository unidadeRepository;

    public AvaliacaoService(
            AvaliacaoRepository repository,
            EmpresaRepository empresaRepository,
            ClienteRepository clienteRepository,
            UnidadeRepository unidadeRepository) {

        this.repository = repository;
        this.empresaRepository = empresaRepository;
        this.clienteRepository = clienteRepository;
        this.unidadeRepository = unidadeRepository;
    }

    @Transactional(readOnly = true)
    public List<Avaliacao> listarTodas() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Avaliacao> listarPorEmpresa(Long empresaId) {
        empresaRepository.findById(empresaId)
                .orElseThrow(() ->
                    new RecursoNaoEncontradoException(
                        "Empresa não encontrada: " + empresaId));

        return repository.findAll().stream()
                .filter(a -> a.getEmpresa() != null
                        && empresaId.equals(a.getEmpresa().getId()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Avaliacao> listarPorEmpresaENota(
            Long empresaId, Integer min, Integer max) {

        if (min == null || max == null ||
                min < 1 || max > 5 || min > max) {
            throw new RegraNegocioException(
                "Informe notas válidas entre 1 e 5.");
        }

        return listarPorEmpresa(empresaId).stream()
                .filter(a -> a.getNota() != null
                        && a.getNota() >= min
                        && a.getNota() <= max)
                .toList();
    }

    @Transactional(readOnly = true)
    public Avaliacao buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                    new RecursoNaoEncontradoException(
                        "Avaliação não encontrada: " + id));
    }

    public Avaliacao cadastrar(Avaliacao avaliacao) {

        if (avaliacao.getEmpresa() == null ||
                avaliacao.getEmpresa().getId() == null) {
            throw new RegraNegocioException(
                "Informe a empresa da avaliação.");
        }

        if (avaliacao.getCliente() == null ||
                avaliacao.getCliente().getId() == null) {
            throw new RegraNegocioException(
                "Informe o cliente da avaliação.");
        }

        if (avaliacao.getUnidade() == null ||
                avaliacao.getUnidade().getId() == null) {
            throw new RegraNegocioException(
                "Informe a unidade da avaliação.");
        }

        if (avaliacao.getNota() == null ||
                avaliacao.getNota() < 1 ||
                avaliacao.getNota() > 5) {
            throw new RegraNegocioException(
                "A nota deve estar entre 1 e 5.");
        }

        var empresa = empresaRepository.findById(
                avaliacao.getEmpresa().getId())
                .orElseThrow(() ->
                    new RecursoNaoEncontradoException(
                        "Empresa não encontrada."));

        var cliente = clienteRepository.findById(
                avaliacao.getCliente().getId())
                .orElseThrow(() ->
                    new RecursoNaoEncontradoException(
                        "Cliente não encontrado."));

        var unidade = unidadeRepository.findById(
                avaliacao.getUnidade().getId())
                .orElseThrow(() ->
                    new RecursoNaoEncontradoException(
                        "Unidade não encontrada."));

        if (!empresa.getId().equals(cliente.getEmpresa().getId()) ||
                !empresa.getId().equals(unidade.getEmpresa().getId())) {
            throw new RegraNegocioException(
                "Cliente e unidade devem pertencer à empresa informada.");
        }

        avaliacao.setId(null);
        avaliacao.setEmpresa(empresa);
        avaliacao.setCliente(cliente);
        avaliacao.setUnidade(unidade);

        if (avaliacao.getData() == null) {
            avaliacao.setData(LocalDateTime.now());
        }

        return repository.save(avaliacao);
    }

    public Avaliacao atualizar(Long id, Avaliacao dados) {

        Avaliacao atual = buscarPorId(id);

        if (dados.getNota() != null &&
                (dados.getNota() < 1 || dados.getNota() > 5)) {
            throw new RegraNegocioException(
                "A nota deve estar entre 1 e 5.");
        }

        atual.setNota(dados.getNota());
        atual.setComentario(dados.getComentario());
        atual.setSentimento(dados.getSentimento());

        if (dados.getCliente() != null &&
                dados.getCliente().getId() != null) {
            var cliente = clienteRepository.findById(
                    dados.getCliente().getId())
                    .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                            "Cliente não encontrado."));
            atual.setCliente(cliente);
        }

        if (dados.getUnidade() != null &&
                dados.getUnidade().getId() != null) {
            var unidade = unidadeRepository.findById(
                    dados.getUnidade().getId())
                    .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                            "Unidade não encontrada."));
            atual.setUnidade(unidade);
        }

        if (dados.getEmpresa() != null &&
                dados.getEmpresa().getId() != null) {
            var empresa = empresaRepository.findById(
                    dados.getEmpresa().getId())
                    .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                            "Empresa não encontrada."));
            atual.setEmpresa(empresa);
        }

        if (!atual.getEmpresa().getId().equals(
                atual.getCliente().getEmpresa().getId()) ||
            !atual.getEmpresa().getId().equals(
                atual.getUnidade().getEmpresa().getId())) {
            throw new RegraNegocioException(
                "Cliente e unidade devem pertencer à empresa informada.");
        }

        return repository.save(atual);
    }

    public void excluir(Long id) {
        repository.delete(buscarPorId(id));
    }
}
