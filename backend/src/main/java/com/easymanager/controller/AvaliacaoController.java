package com.easymanager.controller;
import com.easymanager.model.Avaliacao;
import com.easymanager.service.AvaliacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class AvaliacaoController {
    private final AvaliacaoService service;

    public AvaliacaoController(AvaliacaoService service) {
         this.service = service; 
        }

    @GetMapping public List<Avaliacao> listar() { 
        return service.listarTodas(); 
    }

    @GetMapping("/{id}") public Avaliacao buscar(@PathVariable Long id) { 
        return service.buscarPorId(id);
    }

    @GetMapping("/empresa/{empresaId}") public List<Avaliacao> porEmpresa(@PathVariable Long empresaId) {
        return service.listarPorEmpresa(empresaId);
    }

    @GetMapping("/empresa/{empresaId}/nota")
    public List<Avaliacao> porEmpresaENota(@PathVariable Long empresaId,
            @RequestParam Integer min, @RequestParam Integer max) {
        return service.listarPorEmpresaENota(empresaId, min, max);
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Avaliacao cadastrar(@RequestBody Avaliacao avaliacao) {
        return service.cadastrar(avaliacao); 
    }

    @PutMapping("/{id}") public Avaliacao atualizar(@PathVariable Long id, @RequestBody Avaliacao dados) {
        return service.atualizar(id, dados);
    }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
