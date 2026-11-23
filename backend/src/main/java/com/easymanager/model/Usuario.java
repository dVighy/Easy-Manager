package com.easymanager.model;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity @Table(name="usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY) 
    @Column(name = "id_usuario")
    private Long id;

    @Column(nullable=false, name="nome") private String nome;
    @Column (name="email") private String email;
    @Column (name="senha") private String senha;
    @Column (name="telefone") private String telefone;
    @Column (name="ativo") private Boolean ativo;
    @Column (nullable=false, name="data_criacao") private LocalDateTime dataCriacao;


    public Usuario(){}
    
    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id=id;
    }
    public String getNome(){
        return nome;
    }
    public void setNome(String v){
        this.nome=v;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String v){
        this.email=v;
    }
    public String getSenha(){
        return senha;
    }
    public void setSenha(String v){
        this.senha=v;
    }
    public Boolean getAtivo(){
        return ativo  ;
    }
    public void setAtivo(Boolean v){
        this.ativo=v;
    }
    public String getTelefone(){
        return telefone;
    }
    public void setTelefone(String v){
        this.telefone=v;
    }
    public LocalDateTime getDataCriacao(){
        return dataCriacao;
    }
    public void setDataCriacao(LocalDateTime v){
        this.dataCriacao=v;
    }
}
