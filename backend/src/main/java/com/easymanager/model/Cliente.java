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

@Entity @Table(name="cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY) 
    @Column(name = "id_cliente")
    private Long id;

    @ManyToOne(optional=false) 
    @JoinColumn(name="id_empresa") 
    private Empresa empresa;

    @Column (nullable=false, name="nome") private String nome;
    @Column (nullable=false, name="telefone") private String telefone;
    @Column (nullable=false, name="email") private String email;
    @Column (nullable=false, name="data_cadastro") private LocalDateTime dataCadastro;

    public Cliente(){}

    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id=id;
    }
    
    public String getNome(){
        return nome;
    }
    public void setNome(String nome){
        this.nome = nome;
    }
    public String getTelefone(){
        return telefone;
    }
    public void setTelefone(String telefone){
        this.telefone = telefone;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public LocalDateTime getDataCadastro(){
        return dataCadastro;
    }
    public void setDataCadastro(LocalDateTime dataCadastro){
        this.dataCadastro = dataCadastro;
    }
    public Empresa getEmpresa(){
        return empresa;
    }
    public void setEmpresa(Empresa empresa){
        this.empresa = empresa;
    }
}
