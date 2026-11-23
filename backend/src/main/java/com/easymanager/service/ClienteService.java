package com.easymanager.service;

import com.easymanager.model.Cliente;
import com.easymanager.model.Empresa;
import com.easymanager.repository.ClienteRepository;
import com.easymanager.repository.EmpresaRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;

    public ClienteService(
            ClienteRepository clienteRepository,
            EmpresaRepository empresaRepository) {
        this.clienteRepository = clienteRepository;
        this.empresaRepository = empresaRepository;
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public List<Cliente> listarPorEmpresa(Long empresaId) {
        if (!empresaRepository.existsById(empresaId)) {
            throw new RuntimeException("Empresa não encontrada.");
        }

        return clienteRepository.findByEmpresaId(empresaId);
    }

    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Cliente não encontrado."));
    }

    public Cliente cadastrar(Cliente cliente) {
        if (cliente.getEmpresa() == null ||
                cliente.getEmpresa().getId() == null) {
            throw new RuntimeException("Empresa obrigatória.");
        }

        Empresa empresa = empresaRepository.findById(
                cliente.getEmpresa().getId()
        ).orElseThrow(() ->
                new RuntimeException("Empresa não encontrada."));

        cliente.setEmpresa(empresa);
        cliente.setId(null);

        return clienteRepository.save(cliente);
    }

    public Cliente atualizar(Long id, Cliente dados) {
        Cliente cliente = buscarPorId(id);

        cliente.setNome(dados.getNome());
        cliente.setTelefone(dados.getTelefone());
        cliente.setEmail(dados.getEmail());

        if (dados.getEmpresa() != null &&
                dados.getEmpresa().getId() != null) {

            Empresa empresa = empresaRepository.findById(
                    dados.getEmpresa().getId()
            ).orElseThrow(() ->
                    new RuntimeException("Empresa não encontrada."));

            cliente.setEmpresa(empresa);
        }

        return clienteRepository.save(cliente);
    }

    public void excluir(Long id) {
        Cliente cliente = buscarPorId(id);
        clienteRepository.delete(cliente);
    }
}