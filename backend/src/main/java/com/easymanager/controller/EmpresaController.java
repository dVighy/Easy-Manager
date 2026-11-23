package com.easymanager.controller;
import com.easymanager.model.Empresa;
import com.easymanager.service.EmpresaService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "http://localhost:5173")
public class EmpresaController {
    private final EmpresaService service;
    public EmpresaController(EmpresaService service) { 
        this.service = service; 
    }

    @GetMapping public List<Empresa> listar() { 
        return service.listarTodas(); 
    }
    
    @GetMapping("/{id}") public Empresa buscar(@PathVariable Long id) { 
        return service.buscarPorId(id); 
    }
    
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Empresa cadastrar(@RequestBody Empresa empresa) { 
        return service.cadastrar(empresa); 
    }
    
    @PutMapping("/{id}") public Empresa atualizar(@PathVariable Long id, @RequestBody Empresa dados) {
        return service.atualizar(id, dados);
    }
    
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) { 
        service.excluir(id); 
    }
}
