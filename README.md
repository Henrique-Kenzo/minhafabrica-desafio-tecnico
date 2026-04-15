# Desafio Técnico — MinhaFabrica

Esse repositório é a minha entrega para o desafio técnico do processo seletivo da MinhaFabrica.

A proposta era construir um painel administrativo fullstack com gestão de usuários e produtos, então é exatamente isso que você vai encontrar aqui: uma API REST no backend e uma interface web no frontend, com autenticação via JWT e um CRUD completo para as duas entidades.

## O que eu usei

**Backend:** Node.js + Express 5 + MongoDB (Mongoose 9) + TypeScript  
**Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind CSS v4  
**Auth:** JWT

Escolhi essa stack porque é o que eu tenho mais domínio hoje e porque faz sentido para o escopo do projeto — sem over-engineering, sem biblioteca pra tudo.

## Como rodar

Você vai precisar de Node.js >= 18 e um MongoDB rodando (local ou no Atlas).

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Ajusta o .env com a URI do MongoDB e o JWT_SECRET
npm run dev
```

A API sobe em `http://localhost:3001/api/v1`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A interface sobe em `http://localhost:3000`

### Criando o admin

Com o backend no ar, rode isso uma vez pra criar o usuário inicial:

```bash
curl -X POST http://localhost:3001/api/v1/auth/seed
```

Depois é só logar com:

| Campo  | Valor                  |
| ------ | ---------------------- |
| E-mail | admin@minhafabrica.com |
| Senha  | senha123               |

## Estrutura

```
├── backend/
│   └── src/
│       ├── config/         # Conexão com o banco
│       ├── controllers/    # Entrada da requisição, delega pro service
│       ├── services/       # Regras de negócio
│       ├── repositories/   # Queries ao MongoDB
│       ├── models/         # Schemas Mongoose
│       ├── middlewares/     # Autenticação JWT e tratamento de erros
│       ├── routes/         # Rotas centralizadas
│       └── utils/          # Helpers
│
├── frontend/
│   └── src/
│       ├── app/            # Páginas via App Router
│       ├── components/     # Componentes reutilizáveis
│       ├── hooks/          # Custom hooks (auth)
│       ├── services/       # Axios configurado
│       ├── types/          # Interfaces TypeScript
│       └── lib/            # Utilitários
```

## Endpoints

| Método | Rota                   | Descrição            | Auth  |
| ------ | ---------------------- | -------------------- | ----- |
| POST   | `/api/v1/auth/seed`    | Cria o admin inicial | Não   |
| POST   | `/api/v1/auth/login`   | Login                | Não   |
| GET    | `/api/v1/dashboard`    | Contadores gerais    | Sim   |
| GET    | `/api/v1/users`        | Lista usuários       | Sim   |
| POST   | `/api/v1/users`        | Cria usuário         | Admin |
| PUT    | `/api/v1/users/:id`    | Atualiza usuário     | Admin |
| DELETE | `/api/v1/users/:id`    | Remove usuário       | Admin |
| GET    | `/api/v1/products`     | Lista produtos       | Sim   |
| POST   | `/api/v1/products`     | Cria produto         | Sim   |
| PUT    | `/api/v1/products/:id` | Atualiza produto     | Sim   |
| DELETE | `/api/v1/products/:id` | Remove produto       | Sim   |

## Arquitetura

O backend segue Controller → Service → Repository → Model. Gosto dessa separação porque deixa cada parte com uma responsabilidade bem definida — controller só sabe receber request, service só sabe de regra de negócio, repository só sabe falar com o banco. Facilita muito na hora de testar e de dar manutenção.

---

Qualquer dúvida sobre o projeto ou sobre as decisões técnicas, fico à disposição.
