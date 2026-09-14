# 📈 Easy Manager

### Sistema de Análise de Feedbacks e Indicadores Gerenciais para Estacionamentos

> **Projeto Integrador IV** — Engenharia de Software II
> UNITAU, 2026 · Orientação: Prof. Marcio Moraes
> Autoras: Daphne Almeida e Maria Fernanda Malaquias
> Cliente/produto de referência: **EstacionaFácil**

---

## 📋 Sobre o projeto

O **Easy Manager** é uma solução computacional para centralizar avaliações de clientes de estacionamentos, processar os comentários por meio de técnicas de **Processamento de Linguagem Natural (NLP)** e apresentar indicadores de satisfação e desempenho dos serviços em um painel gerencial.

O objetivo é permitir que gestores acompanhem a evolução da satisfação dos clientes e identifiquem rapidamente quais serviços concentram mais reclamações ou avaliações negativas — sem depender de leitura manual de comentários.

O projeto é tratado como um **MVP acadêmico**, priorizando as funcionalidades necessárias para demonstrar a análise automatizada de feedbacks e a geração de indicadores. A arquitetura foi desenhada para permitir expansão futura para integração com aplicativo de reservas, sistemas de pagamento e outros canais de atendimento, sem exigir reestruturação do sistema.

**Estágio atual:** projeto em fase de concepção — ainda sem funcionalidades implementadas. Este documento cobre o levantamento de requisitos e a arquitetura, etapa que antecede a modelagem UML detalhada e a codificação.

## 🎯 Objetivos

- Centralizar avaliações vindas de diferentes canais em uma única base de dados.
- Classificar automaticamente o sentimento (positivo/neutro/negativo) e a categoria (ex.: atendimento, limpeza, segurança, tempo de espera, preço) de cada comentário.
- Apresentar indicadores de satisfação e desempenho de forma visual e acionável.
- Manter uma arquitetura desacoplada, que permita adicionar novos canais de coleta e integrações sem reescrever os módulos existentes.
- Aplicar, ao longo do projeto, as etapas formais de engenharia de software: levantamento e especificação de requisitos, modelagem UML, projeto de banco de dados, codificação, testes, métricas e gestão de configuração.

## 👤 Público-alvo e atores do sistema

O documento oficial do projeto define quatro atores/público, o que já indica a necessidade de controle de acesso por papel (RBAC):

| Ator | Papel no sistema |
|---|---|
| **Empresas** (ex.: EstacionaFácil) | Segmento-alvo: empresas com contato direto com clientes, interessadas em coletar feedback ativo. |
| **Gestor / Diretor Operacional** | Acompanha indicadores, configura alertas e toma decisões. Acesso de leitura aos dashboards e de escrita nas configurações de alerta. |
| **Administrador** | Gerencia usuários e configurações do sistema. |
| **Sistema de análise** | Ator automatizado — processa os feedbacks automaticamente (módulo de NLP). Vale representá-lo como ator em diagramas de caso de uso, já que age sem intervenção humana direta. |

Essa separação sugere pelo menos dois papéis de usuário autenticado (`GESTOR` e `ADMINISTRADOR`) no modelo de dados, além do processamento automatizado do sistema de análise.

## ✨ Funcionalidades (MVP)

| Módulo | Descrição |
|---|---|
| **Cadastro/Importação de avaliações** | Permite registrar avaliações manualmente ou importar em lote (ex.: CSV), simulando a chegada de dados de múltiplos canais. |
| **Processamento e classificação** | Classifica cada avaliação por sentimento e por categoria de serviço usando técnicas de NLP. |
| **Painel gerencial** | Exibe indicadores de satisfação, evolução temporal e ranking de serviços com mais reclamações. |
| **Armazenamento de dados** | Persiste avaliações brutas e classificadas, servindo de base para os indicadores. |
| **Alertas** | Permite ao gestor configurar limites (ex.: % de avaliações negativas acima de X) e ser notificado quando forem ultrapassados. |
| **Gestão de usuários** | Permite ao administrador criar e gerenciar contas de gestores e as configurações gerais do sistema. |

## 🏗️ Arquitetura

### Visão geral

O sistema segue uma arquitetura em camadas, com separação clara entre coleta de dados, processamento inteligente e apresentação. O diagrama abaixo resume o fluxo principal:

```
Clientes → Coleta/Cadastro (API) → Banco de Dados → Processamento NLP → Painel Gerencial → Gestores
```

### Camadas

1. **Camada de apresentação (Front-end)** — React + TypeScript. Consome a API REST do back-end e exibe o painel gerencial com gráficos e indicadores.
2. **Camada de aplicação (Back-end/API)** — Spring Boot (Java 25). Responsável por regras de negócio, endpoints REST, cadastro/importação de avaliações e orquestração do processamento de NLP.
3. **Camada de processamento de NLP** — Módulo (interno ou externo ao back-end, ver seção específica) responsável por classificar sentimento e categoria de cada avaliação.
4. **Camada de dados** — Banco relacional responsável por armazenar avaliações brutas, avaliações classificadas e os agregados usados nos indicadores.

### Fluxo de dados

1. O cliente registra uma avaliação através de um canal de coleta (formulário web, importação em CSV, etc.).
2. A API recebe, valida e persiste a avaliação no banco de dados.
3. O módulo de NLP processa a avaliação (de forma síncrona ou assíncrona — ver observação abaixo) e grava sentimento/categoria associados ao registro.
4. O módulo de indicadores agrega os dados classificados em métricas (médias, tendências, rankings).
5. O painel gerencial consome essas métricas via API e apresenta ao gestor.

> **Observação de design:** processar o NLP de forma **assíncrona** (fila de processamento ou job agendado) evita que a criação de uma avaliação fique lenta esperando a classificação terminar. Para o MVP acadêmico, um processamento síncrono simples já é suficiente para demonstrar o conceito; a versão assíncrona é uma evolução natural a documentar no roadmap.

### Pontos de extensão

A camada de "Coleta/Cadastro" foi pensada como o único ponto de entrada de novos dados no sistema. Isso significa que futuras integrações (app de reservas, sistemas de pagamento, WhatsApp, redes sociais) podem ser adicionadas como novos adaptadores que alimentam essa camada, sem exigir mudanças no processamento de NLP, no armazenamento ou no painel.

## 🧠 Processamento de Linguagem Natural

Como o back-end definido é 100% Java, existem três caminhos possíveis para o módulo de NLP, com trade-offs diferentes:

| Abordagem | Como funciona | Vantagens | Desvantagens | Indicada para |
|---|---|---|---|---|
| **Bibliotecas Java nativas** (Apache OpenNLP, Stanford CoreNLP) | Classificação roda dentro do próprio back-end Spring | Mantém stack único, sem dependências externas, funciona offline | Menor precisão que modelos modernos; configuração/treinamento de modelo dá trabalho | MVP acadêmico com foco em stack único |
| **API de LLM externa** (ex.: OpenAI, Hugging Face Inference API) | Back-end envia o texto do comentário para uma API externa e recebe sentimento/categoria já classificados | Alta precisão, rápido de implementar, pouco código | Depende de internet e de chave de API; pode ter custo | MVP acadêmico com foco em resultado rápido e preciso |
| **Microsserviço Python dedicado** (spaCy, transformers) | Back-end Java chama um serviço Python via REST, especializado em NLP | Ecossistema de NLP mais maduro; reaproveitável para outros projetos | Introduz um segundo serviço, mais infraestrutura e complexidade de deploy | Evolução pós-MVP, se o projeto crescer além da disciplina |

**Recomendação para o MVP:** começar com bibliotecas Java nativas ou uma API de LLM externa (a segunda opção tende a entregar resultados mais convincentes para a demonstração, com menos esforço de implementação). O microsserviço Python fica documentado como evolução no roadmap.

## 🗄️ Modelo de dados (visão inicial)

Entidades centrais sugeridas para o MVP:

- **Estacionamento** — unidade avaliada (útil já para permitir múltiplas unidades no futuro).
- **Cliente** — quem faz a avaliação (pode ser anônimo no MVP).
- **Avaliacao** — nota, comentário, data, canal de origem.
- **Categoria** — tema do serviço (atendimento, limpeza, segurança, tempo de espera, preço, etc.).
- **ClassificacaoNLP** — sentimento, score de confiança, categoria detectada, vinculada 1:1 à avaliação.
- **Usuario** — pessoa com acesso ao painel; possui um papel (`GESTOR` ou `ADMINISTRADOR`), conforme os atores definidos no documento oficial do projeto.
- **AlertaConfig** — regra configurada pelo gestor (métrica monitorada, limite, destinatário) para disparo de notificação quando um indicador ultrapassa o valor definido.

> Recomendo formalizar isso em um diagrama ER (posso gerar um se quiser, junto com os relacionamentos e chaves).

### PostgreSQL ou Oracle

O documento oficial do projeto especifica **Postgres ou Oracle** como opções de banco (não MySQL, como constava numa versão anterior deste README). Comparando as duas:

| | PostgreSQL | Oracle |
|---|---|---|
| Custo | Gratuito e open source | Pago em produção; **Oracle Database Express Edition (XE)** é gratuita para uso acadêmico/local |
| Texto e JSON | Suporte nativo (`tsvector`, `jsonb`) — útil para buscar em comentários e guardar o resultado bruto do NLP | Recursos equivalentes (Oracle Text, JSON), porém com sintaxe e configuração mais verbosas |
| Curva de aprendizado | Mais simples, comunidade grande | Mais robusto para cenários corporativos, mas mais pesado para um MVP acadêmico |
| Integração com Spring | Excelente — driver padrão nos tutoriais de Spring Data JPA | Também suportada, exige driver `ojdbc` e configuração adicional |

**Recomendação:** PostgreSQL para o MVP, pelo menor atrito de configuração. Oracle fica como opção caso a disciplina exija especificamente essa tecnologia — nesse caso, usar a Oracle XE local evita custo de licença.

## 🛠️ Stack tecnológica

**Front-end:**
* <img src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" width="22" height="22" valign="middle" /> React;
* <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/node_js.png" width="22" height="22" valign="middle" /> Node.js;
* <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/typescript.png" width="22" height="22" valign="middle" /> TypeScript;

**Back-end:**
* <img src="https://raw.githubusercontent.com/devicons/devicon/7330accdbc47e2dc0c19789a48533c4a3c50fe58/icons/java/java-original.svg" width="22" height="22" valign="middle" /> Java 25;
* <img src="https://user-images.githubusercontent.com/25181517/117201470-f6d56780-adec-11eb-8f7c-e70e376cfd07.png" width="22" height="22" valign="middle" /> Spring;
* <img src="https://raw.githubusercontent.com/devicons/devicon/7330accdbc47e2dc0c19789a48533c4a3c50fe58/icons/maven/maven-original.svg" width="22" height="22" valign="middle" /> Maven;

**Database:**
* <img src="https://raw.githubusercontent.com/devicons/devicon/7330accdbc47e2dc0c19789a48533c4a3c50fe58/icons/mysql/mysql-original.svg" width="22" height="22" valign="middle" /> MySQL;
* <img src = "https://raw.githubusercontent.com/devicons/devicon/7330accdbc47e2dc0c19789a48533c4a3c50fe58/icons/postgresql/postgresql-original.svg" widht="22" height="22" valign="middle" /> PostgreSQL;

**Tools:**
* <img src="https://raw.githubusercontent.com/devicons/devicon/7330accdbc47e2dc0c19789a48533c4a3c50fe58/icons/intellij/intellij-original.svg" width="22" height="22" valign="middle" /> IntelliJ;
  


## 📁 Estrutura de pastas proposta

```
easy-manager/
├── frontend/                  # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/           # chamadas à API
│   └── package.json
├── backend/                   # Spring Boot (Java 25)
│   ├── src/main/java/com/easymanager/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── nlp/                # classificação de sentimento/categoria
│   │   └── dto/
│   └── pom.xml
├── docs/                       # documentação, diagramas, ADRs
└── README.md
```

## 🚀 Como executar

> Instruções a serem preenchidas conforme o projeto avança. Estrutura sugerida:

```bash
# Back-end
cd backend
mvn spring-boot:run

# Front-end
cd frontend
npm install
npm run dev
```

Configurar a conexão com o banco de dados em `backend/src/main/resources/application.properties` (ou `.yml`) antes de subir o back-end.

## 🗺️ Roadmap

- [ ] **Fase 1 (MVP):** cadastro/importação manual, classificação básica de sentimento, painel com indicadores essenciais.
- [ ] **Fase 2:** processamento assíncrono de NLP (fila/job).
- [ ] **Fase 3:** integração com aplicativo de reservas.
- [ ] **Fase 4:** integração com sistemas de pagamento.
- [ ] **Fase 5:** novos canais de atendimento (WhatsApp, redes sociais, etc.).

## 👥 Equipe

| Nome | Função |
|---|---|
| Daphne Almeida | DEV |
| Maria Fernanda Malaquias | DEV |

**Orientação:** Prof. Marcio Moraes e Prof. Dawilmar — UNITAU, 2026

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais no âmbito do Projeto Integrador IV / Engenharia de Software II — UNITAU.
