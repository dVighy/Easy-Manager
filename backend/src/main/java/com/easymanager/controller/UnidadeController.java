package com.easymanager.controller;
import com.easymanager.model.Unidade;
import com.easymanager.service.UnidadeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/unidades")
@CrossOrigin(origins = "http://localhost:5173")
public class UnidadeController {
    private final UnidadeService service;
    public UnidadeController(UnidadeService service) { 
        this.service = service; 
    }

    @GetMapping public List<Unidade> listar() { 
        return service.listarTodas(); 
    }
    @GetMapping("/{id}") public Unidade buscar(@PathVariable Long id) { 
        return service.buscarPorId(id); }
    
    @GetMapping("/empresa/{empresaId}") public List<Unidade> porEmpresa(@PathVariable Long empresaId) {
        return service.listarPorEmpresa(empresaId);
    }
    
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Unidade cadastrar(@RequestBody Unidade unidade) { 
        return service.cadastrar(unidade); 
    }
    
    @PutMapping("/{id}") public Unidade atualizar(@PathVariable Long id, @RequestBody Unidade dados) {
        return service.atualizar(id, dados);
    }
    
    @PatchMapping("/{id}/status") public Unidade status(@PathVariable Long id, @RequestParam Boolean ativo) {
        return service.alterarStatus(id, ativo);
    }
    
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) { 
        service.excluir(id); 
    }
}
