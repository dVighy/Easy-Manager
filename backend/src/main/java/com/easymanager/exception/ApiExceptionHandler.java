package com.easymanager.exception;

import com.easymanager.service.RecursoNaoEncontradoException;
import com.easymanager.service.RegraNegocioException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<?> naoEncontrado(RecursoNaoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", 404, "erro", "Recurso não encontrado",
                "mensagem", ex.getMessage(), "dataHora", LocalDateTime.now().toString()));
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<?> regraNegocio(RegraNegocioException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "status", 400, "erro", "Regra de negócio",
                "mensagem", ex.getMessage(), "dataHora", LocalDateTime.now().toString()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> erroInterno(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "status", 500, "erro", "Erro interno",
                "mensagem", "Ocorreu um erro ao processar a solicitação.",
                "dataHora", LocalDateTime.now().toString()));
    }
}
