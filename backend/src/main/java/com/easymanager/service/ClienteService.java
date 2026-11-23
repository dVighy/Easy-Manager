package com.easymanager.service;

import com.easymanager.model.Cliente;
import com.easymanager.repository.ClienteRepository;
import com.easymanager.repository.EmpresaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ClienteService {
    private final ClienteRepository repository;
    private final EmpresaRepository empresaRepository;

    public ClienteService(ClienteRepository repository, EmpresaRepository empresaRepository) {
        this.repository = repository;
        this.empresaRepository = empresaRepository;
    }

    @Transactional(readOnly = true)
    public List<Cliente> listarTodos() { return repository.findAll(); }

    @Transactional(readOnly = true)
    public List<Cliente> listarPorEmpresa(Long empresaId) {
        empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa não encontrada: " + empresaId));
        return repository.findAll().stream()
                .filter(c -> c.getEmpresa() != null && empresaId.equals(c.getEmpresa().getId()))
                .toList();
    }

    @Transactional(readOnly = true)
    public Cliente buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado: " + id));
    }

    public Cliente cadastrar(Cliente cliente) {
        if (cliente.getEmpresa() == null || cliente.getEmpresa().getId() == null)
            throw new RegraNegocioException("Informe o id da empresa do cliente.");
        var empresa = empresaRepository.findById(cliente.getEmpresa().getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa não encontrada."));
        cliente.setId(null);
        cliente.setEmpresa(empresa);
        if (cliente.getDataCadastro() == null)
            throw new RegraNegocioException("Informe a data de cadastro do cliente.");
        return repository.save(cliente);
    }

    public Cliente atualizar(Long id, Cliente dados) {
        Cliente atual = buscarPorId(id);
        atual.setNome(dados.getNome());
        atual.setTelefone(dados.getTelefone());
        atual.setEmail(dados.getEmail());
        if (dados.getEmpresa() != null && dados.getEmpresa().getId() != null) {
            var empresa = empresaRepository.findById(dados.getEmpresa().getId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Empresa não encontrada."));
            atual.setEmpresa(empresa);
        }
        return repository.save(atual);
    }

    public void excluir(Long id) { repository.delete(buscarPorId(id)); }
}
