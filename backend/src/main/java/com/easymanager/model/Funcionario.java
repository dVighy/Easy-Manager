package com.easymanager.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity @Table(name="funcionario")
public class Funcionario {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY) 
    @Column(name = "id_funcionario")
    private Long id;

    @Column(nullable=false) private String nome;

    @Column (name="cargo_funcao") private String cargo;
    @Column (name="email") private String email;
    @Column (name="telefone") private String telefone;

    @ManyToOne(optional=false) 
    @JoinColumn(name="id_empresa") 
    private Empresa empresa;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo;
    
    public Funcionario(){}
    
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
    public String getCargo(){
        return cargo;
    }
    public void setCargo(String v){
        this.cargo=v;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String v){
        this.email=v;
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
    public Boolean getAtivo(){
        return ativo;
    }
    public void setAtivo(Boolean v){
        this.ativo=v;
    }
}
