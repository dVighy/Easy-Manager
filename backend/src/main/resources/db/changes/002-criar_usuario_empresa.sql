
CREATE TABLE usuario_empresa (
    id_usuario_empresa BIGSERIAL PRIMARY KEY,

    id_usuario BIGINT NOT NULL,
    id_empresa BIGINT NOT NULL,

    perfil VARCHAR(20) NOT NULL DEFAULT 'FUNCIONARIO',

    CONSTRAINT fk_usuario_empresa_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    CONSTRAINT fk_usuario_empresa_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES empresa(id_empresa),

    CONSTRAINT uk_usuario_empresa
        UNIQUE (id_usuario, id_empresa),

    CONSTRAINT chk_usuario_empresa_perfil
        CHECK (perfil IN ('DONO', 'GERENTE', 'FUNCIONARIO'))
);
