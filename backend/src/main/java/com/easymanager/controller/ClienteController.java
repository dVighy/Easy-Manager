package com.easymanager.controller;
import com.easymanager.model.Cliente;
import com.easymanager.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:5173")
public class ClienteController {
    private final ClienteService service;
    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping public List<Cliente> listar() { 
        return service.listarTodos(); 
    }
    
    @GetMapping("/{id}") public Cliente buscar(@PathVariable Long id) { 
        return service.buscarPorId(id); 
    }
    
    @GetMapping("/empresa/{empresaId}") public List<Cliente> porEmpresa(@PathVariable Long empresaId) {
        return service.listarPorEmpresa(empresaId);
    }
    
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Cliente cadastrar(@RequestBody Cliente cliente) {
        return service.cadastrar(cliente); 
    }
    
    @PutMapping("/{id}") public Cliente atualizar(@PathVariable Long id, @RequestBody Cliente dados) {
        return service.atualizar(id, dados);
    }
    
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
