package com.easymanager.controller;
import com.easymanager.model.Funcionario;
import com.easymanager.service.FuncionarioService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "http://localhost:5173")
public class FuncionarioController {
    private final FuncionarioService service;
    public FuncionarioController(FuncionarioService service) { 
        this.service = service; 
    }

    @GetMapping public List<Funcionario> listar() {
         return service.listarTodos();
    }

    @GetMapping("/{id}") public Funcionario buscar(@PathVariable Long id) {
         return service.buscarPorId(id); 
    }

    @GetMapping("/empresa/{empresaId}") public List<Funcionario> porEmpresa(@PathVariable Long empresaId) {
        return service.listarPorEmpresa(empresaId);
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Funcionario cadastrar(@RequestBody Funcionario funcionario) {
         return service.cadastrar(funcionario); 
    }

    @PutMapping("/{id}") public Funcionario atualizar(@PathVariable Long id, @RequestBody Funcionario dados) {
        return service.atualizar(id, dados);
    }

    @PatchMapping("/{id}/status") public Funcionario status(@PathVariable Long id, @RequestParam Boolean ativo) {
        return service.alterarStatus(id, ativo);
    }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) { 
        service.excluir(id);
     }
}
