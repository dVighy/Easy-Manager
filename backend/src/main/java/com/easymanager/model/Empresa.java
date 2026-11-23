package com.easymanager.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name="empresa")
public class Empresa {
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column (name = "id_empresa")
    private Long id;
    
    @Column(nullable=false) private String nome;
    
    @Column(unique=true) private String cnpj;

    public Empresa() {}
    
    public Empresa(String nome,String cnpj){
        this.nome=nome;
        this.cnpj=cnpj;
    }

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
        this.nome=nome;
    } 
    
    public String getCnpj(){
        return cnpj;
    }
    public void setCnpj(String cnpj){
        this.cnpj=cnpj;
    }
}
