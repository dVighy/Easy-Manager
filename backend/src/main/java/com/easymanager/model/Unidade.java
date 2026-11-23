package com.easymanager.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity @Table(name="unidade")
public class Unidade {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY) 
    @Column(name = "id_unidade")
    private Long id;

    @Column(nullable=false, name="nome") private String nome;
    @Column (name="endereco") private String endereco;
    @Column (name="ativo") private Boolean ativo;
    @Column (name="telefone") private String telefone;

    @ManyToOne(optional=false) 
    @JoinColumn(name="id_empresa") 
    private Empresa empresa;
    
    public Unidade(){}
    
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
    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
    public String getEndereco(){
        return endereco;
    }
    public void setEndereco(String v){
        this.endereco=v;
    }
    public String getTelefone(){
        return telefone;
    }
    public void setTelefone(String v){
        this.telefone=v;
    }
    public Empresa getEmpresa(){
        return empresa;
    }
    public void setEmpresa(Empresa v){
        this.empresa=v;
    }
}
