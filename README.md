# 🏭 MinhaFabrica — Desafio Técnico

---

👋 Olá! Este repositório contém a minha entrega para o desafio técnico da **MinhaFabrica** para a vaga de **Assistente de Desenvolvimento**.

Este projeto foi desenvolvido como parte do processo seletivo. Busquei aplicar boas práticas de organização, separação de responsabilidades e validação de dados para construir uma base legível, previsível e fácil de manter.

---

## 🚀 Propósito do Sistema

O sistema é uma plataforma administrativa fullstack restrita com autenticação via JWT e gestão (CRUD) de Usuários e Produtos. O foco não foi apenas implementar operações básicas, mas garantir consistência dos dados e estabilidade da aplicação.

---

## 📸 Uma Espiada no Sistema

_(Estampas visuais ilustrando a interface desenvolvida para o painel)_

<div align="center">
  <img src="./docs/login.png" alt="Tela de Login" width="48%">
  <img src="./docs/dashboard.png" alt="Dashboard Principal" width="48%">
  <br>
  <img src="./docs/usuarios.png" alt="Listagem de Usuários" width="48%">
  <img src="./docs/produtos.png" alt="Gestão de Produtos" width="48%">
</div>

---

## 🛠️ Tecnologias Utilizadas

Escolhi tecnologias consolidadas no ecossistema atual para garantir uma entrega consistente e que se apoia em boas práticas de mercado:

- **Backend:** Node.js (Express 5) + TypeScript + Mongoose (MongoDB)
  - _Por quê?_ O ecossistema Node com TypeScript fornece tipagem mais segura no fluxo de dados. O Express é uma solução testada para roteamento, e o MongoDB se adequa bem ao escopo e à flexibilidade de modelagem do desafio.
- **Frontend:** Next.js (App Router) + React 19 + TypeScript + Tailwind CSS v4
  - _Por quê?_ O Next.js agiliza a construção de painéis fornecendo roteamento e organização nativa clara. O Tailwind CSS facilita a criação de interfaces responsivas de forma prática e coesa.
- **Segurança:** JWT, express-rate-limit, Helmet e express-mongo-sanitize
  - _Por quê?_ Implementei middlewares de segurança básicos para reduzir riscos comuns como brute force e injeções maliciosas nos inputs (ex: NoSQL Injection).
- **Validação & Testes:** Zod e Jest + Supertest
  - _Por quê?_ O Zod garante que os dados obedeçam ao formato esperado. Utilizei Jest e Supertest para validar o comportamento das rotas críticas e reduzir regressões.

---

## 🏗️ Estrutura e Decisões Técnicas

Construí o código focando na separação de responsabilidades para facilitar a leitura e manutenção:

1. **Arquitetura em Camadas (Controller → Service → Repository → Model):** Adotei esse padrão para organizar responsabilidades e fluxos na API de forma previsível e modular.
2. **Armazenamento de Imagens Modular (Cloudinary):** Visando infraestruturas serverless e evitando lentidão e o natural "inchaço" da base de dados (ou acúmulo de arquivos HD local), integrei o aplicativo com o Cloudinary para hospedar as imagens dos produtos de forma dedicada.
3. **Cobertura Base de Testes:** Implementei testes unitários e de integração cobrindo os principais fluxos da aplicação no backend.
4. **Tratamento de Permissões:** No front com Next.js, utilizei o _Middleware Edge_ para interceptar rotas privadas, garantindo filtragem e redirecionamento caso o usuário não possua um Token JWT válido.
5. **Pré-buscas e Listagens:** Mantive estados locais para reduzir chamadas desnecessárias à API durante navegação e paginação.

---

## 📌 Observações

Durante o desenvolvimento, priorizei clareza e organização ao invés de complexidade desnecessária. Algumas decisões foram simplificadas considerando o escopo do desafio.

---

## 💻 Como Rodar o Projeto Localmente

**Pré-requisitos Básicos:** Node.js (>= 18) e Banco de Dados MongoDB habilitado e acessível.

### 1. Início e Setup da API

```bash
cd backend
npm install
cp .env.example .env
# Adicione sua URI do MongoDB e defina um hash para o JWT_SECRET dentro do arquivo .env
npm run dev
```

> Obs: _Para poder acessar o frontend logo de cara, adicione o Admin primário via POST (sem body) em:_  
> `http://localhost:3001/api/v1/auth/seed`

### 2. Validar Testes no Back-end (Opcional)

```bash
cd backend
npm test
```

### 3. Rodar Interface Visual (Front-end)

```bash
cd frontend
npm install
npm run dev
```

Acesse a aplicação pela porta padrão: `http://localhost:3000`.

---

## 🚧 Evoluções Futuras (Pontos de Atenção)

Procurando melhorias para a escala da aplicação em um cenário corporativo intenso, destaco:

- **Camada de Cache (ex: Redis)**: Quando a demanda sobe, rotas muito consultadas (como estatísticas de Dashboard) teriam benefícios massivos de performance reduzindo a necessidade de consultas diretas ao banco via cache in-memory.
- **Filas de Processamento (Background Jobs)**: Operações sensíveis ao tempo que chamam processamentos passivos (como notificações por e-mail ou reajuste de estoque em lote) poderiam se beneficiar de mensagerias (ex: BullMQ) para não interromper a fluidez de entrega das APIs.

---

## 🤝 Considerações Finais

Esse projeto representa meu nível atual e a minha forma de organizar e desenvolver aplicações web. Estou em evolução tecnológica contínua e estou aberto a feedbacks técnicos e arquiteturais.

Busco demonstrar que tenho uma base sólida e capacidade de evoluir com consistência em um ambiente colaborativo, absorvendo boas práticas e contribuindo ativamente com o time.

Agradeço imensamente pelo tempo de revisão dedicado à minha entrega!
