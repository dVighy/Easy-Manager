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

@Entity @Table(name="avaliacao")
public class Avaliacao {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY) 
    @Column(name = "id_avaliacao")
    private Long id;

    @Column(length=2000) private String comentario;
    @Column(nullable=false) private Integer nota;

    @Column (name="sentimento") private String sentimento;

    @Column (name="data_avaliacao") private LocalDateTime data;

    @ManyToOne(optional=false) 
    @JoinColumn(name="id_empresa") 
    private Empresa empresa;

    @ManyToOne(optional=false) 
    @JoinColumn(name="id_cliente") 
    private Cliente cliente;

    @ManyToOne(optional=false) 
    @JoinColumn(name="id_unidade") 
    private Unidade unidade;

    public Avaliacao(){}

    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id=id;
    }
    public Cliente getCliente(){
        return cliente;
    }
    public void setCliente(Cliente cliente){
        this.cliente = cliente;
    }
    public String getComentario(){
        return comentario;
    }
    public void setComentario(String comentario){
        this.comentario = comentario;
    }
    public Integer getNota(){
        return nota;
    }
    public void setNota(Integer nota){
        this.nota = nota;
    }
    public String getSentimento(){
        return sentimento;
    }
    public void setSentimento(String sentimento){
        this.sentimento = sentimento;
    }
    public LocalDateTime getData(){
        return data;
    }
    public void setData(LocalDateTime data){
        this.data = data;
    }
    public Empresa getEmpresa(){
        return empresa;
    }
    public void setEmpresa(Empresa empresa){
        this.empresa = empresa;
    }
    public Unidade getUnidade(){
        return unidade;
    }
    public void setUnidade(Unidade unidade){
        this.unidade = unidade;
    }
}
