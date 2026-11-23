package com.easymanager.controller;
import com.easymanager.model.Usuario;
import com.easymanager.dto.UsuarioLoginDTO;
import com.easymanager.dto.UsuarioRespostaDTO;
import com.easymanager.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) { 
        this.service = service; 
    }

    @PostMapping("/login")
    public UsuarioRespostaDTO login(@RequestBody UsuarioLoginDTO login) {
        Usuario usuario = service.autenticar(
            login.email(),
            login.senha()
        );

        return UsuarioRespostaDTO.de(usuario);
    }

    @GetMapping public List<UsuarioRespostaDTO> listar() {
        return service.listarTodos().stream().map(UsuarioRespostaDTO::de).toList();
    }
    
    @GetMapping("/{id}") public UsuarioRespostaDTO buscar(@PathVariable Long id) {
        return UsuarioRespostaDTO.de(service.buscarPorId(id));
    }
    
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public UsuarioRespostaDTO cadastrar(@RequestBody Usuario usuario) {
        return UsuarioRespostaDTO.de(service.cadastrar(usuario));
    }
    
    @PutMapping("/{id}") public UsuarioRespostaDTO atualizar(@PathVariable Long id, @RequestBody Usuario dados) {
        return UsuarioRespostaDTO.de(service.atualizar(id, dados));
    }
    
    @PatchMapping("/{id}/status") public UsuarioRespostaDTO status(@PathVariable Long id, @RequestParam Boolean ativo) {
        return UsuarioRespostaDTO.de(service.alterarStatus(id, ativo));
    }
    
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) { 
        service.excluir(id); 
    }
}
