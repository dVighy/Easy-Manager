# Easy Manager — Services e Controllers

## Endpoints previstos

### Empresas — `/api/empresas`
- GET `/api/empresas`
- GET `/api/empresas/{id}`
- POST `/api/empresas`
- PUT `/api/empresas/{id}`
- DELETE `/api/empresas/{id}`

### Unidades — `/api/unidades`
- GET `/api/unidades`
- GET `/api/unidades/{id}`
- GET `/api/unidades/empresa/{empresaId}`
- POST `/api/unidades`
- PUT `/api/unidades/{id}`
- PATCH `/api/unidades/{id}/status?ativo=true`
- DELETE `/api/unidades/{id}`

### Funcionários — `/api/funcionarios`
- GET `/api/funcionarios`
- GET `/api/funcionarios/{id}`
- GET `/api/funcionarios/empresa/{empresaId}`
- POST `/api/funcionarios`
- PUT `/api/funcionarios/{id}`
- PATCH `/api/funcionarios/{id}/status?ativo=true`
- DELETE `/api/funcionarios/{id}`

### Clientes — `/api/clientes`
- GET `/api/clientes`
- GET `/api/clientes/{id}`
- GET `/api/clientes/empresa/{empresaId}`
- POST `/api/clientes`
- PUT `/api/clientes/{id}`
- DELETE `/api/clientes/{id}`

### Avaliações — `/api/avaliacoes`
- GET `/api/avaliacoes`
- GET `/api/avaliacoes/{id}`
- GET `/api/avaliacoes/empresa/{empresaId}`
- GET `/api/avaliacoes/empresa/{empresaId}/nota?min=1&max=5`
- POST `/api/avaliacoes`
- PUT `/api/avaliacoes/{id}`
- DELETE `/api/avaliacoes/{id}`

### Usuários — `/api/usuarios`
- GET `/api/usuarios`
- GET `/api/usuarios/{id}`
- POST `/api/usuarios`
- PUT `/api/usuarios/{id}`
- PATCH `/api/usuarios/{id}/status?ativo=true`
- DELETE `/api/usuarios/{id}`

## Observações importantes
- Os endpoints de exclusão usam exclusão física (`delete`). Para registros que precisam
  permanecer no histórico, prefira desativação lógica (PATCH status).
- O CRUD de usuário aqui não implementa autenticação, autorização, hash de senha ou JWT.
  Não coloque senha em respostas HTTP. Antes de disponibilizar login em produção,
  implemente Spring Security e BCrypt.
- O endpoint de listagem de usuários retorna DTO sem senha.
- Para criar entidades com relacionamentos, envie o objeto relacionado contendo o `id`,
  por exemplo: `"empresa": {"id": 1}`. Isso pressupõe que suas Models exponham esse campo
  como `id` no JSON. Se seu projeto usa outro formato, adapte o DTO/mapeamento.
- O pacote não inclui `pom.xml`, configuração de banco nem changelog, justamente para
  preservar os arquivos que já existem no seu projeto.
