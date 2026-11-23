
package com.easymanager.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(
    name = "usuario_empresa",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_usuario_empresa",
            columnNames = {"id_usuario", "id_empresa"}
        )
    }
)
public class UsuarioEmpresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario_empresa")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_cargo", nullable = false)
    private Cargo cargo;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "data_vinculo", nullable = false)
    private LocalDateTime dataVinculo;

    @Column(nullable = false, length = 20)
    private String perfil;

    @PrePersist
    public void prePersist() {
        if (dataVinculo == null) {
            dataVinculo = LocalDateTime.now();
        }
        if (ativo == null) {
            ativo = true;
        }
    }

    public UsuarioEmpresa() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public Cargo getCargo() {
        return cargo;
    }

    public void setCargo(Cargo cargo) {
        this.cargo = cargo;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDateTime getDataVinculo() {
        return dataVinculo;
    }

    public void setDataVinculo(LocalDateTime dataVinculo) {
        this.dataVinculo = dataVinculo;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }
}
