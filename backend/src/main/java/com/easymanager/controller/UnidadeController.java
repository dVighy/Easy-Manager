package com.easymanager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.easymanager.model.Unidade;
import com.easymanager.service.UnidadeService;

@RestController
@RequestMapping("/api/unidades")
@CrossOrigin(origins = "http://localhost:5173")
public class UnidadeController {

    private final UnidadeService unidadeService;

    public UnidadeController(UnidadeService unidadeService) {
        this.unidadeService = unidadeService;
    }

    @GetMapping
    public List<Unidade> listarTodas() {
        return unidadeService.listarTodas();
    }

    @GetMapping("/{id}")
    public Unidade buscarPorId(@PathVariable Long id) {
        return unidadeService.buscarPorId(id);
    }

    @GetMapping("/empresa/{empresaId}")
    public List<Unidade> listarPorEmpresa(
            @PathVariable Long empresaId) {
        return unidadeService.listarPorEmpresa(empresaId);
    }

    @PostMapping
    public Unidade cadastrar(@RequestBody Unidade unidade) {
        return unidadeService.cadastrar(unidade);
    }

    @PutMapping("/{id}")
    public Unidade atualizar(
            @PathVariable Long id,
            @RequestBody Unidade unidade) {
        return unidadeService.atualizar(id, unidade);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        unidadeService.excluir(id);
    }
}