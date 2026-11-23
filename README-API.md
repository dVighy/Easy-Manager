# Easy Manager API (starter)

## Banco PostgreSQL
Crie um banco chamado `easymanager`. Os defaults da API são `postgres`/`postgres`; altere `application.properties` ou configure as variáveis `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.

## Executar
Com Java 21+ e Maven instalado:
`mvn spring-boot:run`

## Endpoints iniciais
- GET/POST `/api/empresas`
- GET/PUT/DELETE `/api/empresas/{id}`
- GET `/api/funcionarios?empresaId=1`, POST `/api/funcionarios`, PUT/DELETE `/api/funcionarios/{id}`
- GET `/api/avaliacoes?empresaId=1`, POST `/api/avaliacoes`, PUT/DELETE `/api/avaliacoes/{id}`

POST funcionário exemplo:
`{"nome":"Nome","cargo":"Atendente","departamento":"Atendimento","email":"email@exemplo.com","telefone":"(12) 99999-0000","empresa":{"id":1}}`

POST avaliação exemplo:
`{"cliente":"Cliente","comentario":"Gostei","nota":5,"sentimento":"Positivo","data":"2026-11-22","empresa":{"id":1}}`

Esta primeira versão é uma API de demonstração para desenvolvimento: não possui autenticação nem autorização. Não a publique na internet antes de adicionar segurança, validações e tratamento de erros.
