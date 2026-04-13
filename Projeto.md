# DESAFIO TÉCNICO

### Processo Seletivo — Assistente de Desenvolvimento

## MinhaFabrica

###### Londrina/PR — Abril 2026

##### PRAZO DE ENTREGA

###### Até 19 de Abril de 2026 (Domingo) às 23:

```
Entregas após esta data serão automaticamente desconsideradas.
```
###### STACK OBRIGATÓRIA

Backend: Node.js + Express + MongoDB (Mongoose)
Frontend: Next.js + React + TypeScript + Tailwind CSS
Auth: JWT (JSON Web Token)
Versionamento: Git + GitHub


## 1. O DESAFIO

Você deverá desenvolver uma aplicação web completa (frontend + backend) com as seguintes
funcionalidades:

###### TELA DE LOGIN

- Autenticação com e-mail e senha
- Validação de campos (e-mail válido, senha obrigatória)
- Feedback visual de erro (credenciais inválidas)
- Após login bem-sucedido, redirecionar para o painel administrativo
- Proteção de rotas — só acessar o painel se estiver autenticado

###### PAINEL ADMINISTRATIVO

- Layout com sidebar ou navbar de navegação
- Dashboard simples com contadores (total de usuários, total de produtos)
- Acesso restrito apenas para usuários autenticados

```
CRUD DE USUÁRIOS
```
- Listar todos os usuários em tabela
- Criar novo usuário (nome, e-mail, senha, perfil)
- Editar usuário existente
- Excluir usuário (com confirmação)
- Validações nos formulários (campos obrigatórios, e-mail válido)

```
CRUD DE PRODUTOS
```
- Listar todos os produtos em tabela
- Criar novo produto (nome, descrição, preço, quantidade em estoque, categoria)
- Editar produto existente
- Excluir produto (com confirmação)
- Validações nos formulários (preço positivo, estoque >= 0)


## 2. REQUISITOS TÉCNICOS

#### 2.1 BACKEND (Node.js + Express + MongoDB)

- Arquitetura obrigatória: Controller › Service › Repository › Model
- Rotas versionadas: /api/v1/auth/login, /api/v1/users, /api/v1/products
- Autenticação: JWT (jsonwebtoken) com middleware de verificação
- Banco de dados: MongoDB com Mongoose (schemas tipados)
- Variáveis de ambiente: usar .env com dotenv (nunca commitar credenciais)
- Respostas de erro: sempre { message: string } com status HTTP correto
- Seed: criar um script ou rota para popular o banco com um usuário admin inicial

Estrutura de pastas sugerida no backend:

```
src/
config/ # Conexão com banco, variáveis de ambiente
controllers/ # Recebem req/res, delegam para services
services/ # Regras de negócio
repositories/ # Queries ao MongoDB via Mongoose
models/ # Schemas Mongoose (User, Product)
routes/ # Definição de rotas Express
middlewares/ # Auth (verifyToken), tratamento de erros
utils/ # Helpers (ex: hash de senha)
app.js # Entry point
```
Endpoints mínimos esperados:

```
Método Rota Descrição Auth
POST /api/v1/auth/login Login (retorna JWT) Não
GET /api/v1/users Listar usuários Sim
POST /api/v1/users Criar usuário Sim
PUT /api/v1/users/:id Atualizar usuário Sim
DELETE /api/v1/users/:id Excluir usuário Sim
GET /api/v1/products Listar produtos Sim
POST /api/v1/products Criar produto Sim
PUT /api/v1/products/:id Atualizar produto Sim
DELETE /api/v1/products/:id Excluir produto Sim
GET /api/v1/dashboard Contadores (usuários/produtos) Sim
```

#### 2.2 FRONTEND (Next.js + React + TypeScript + Tailwind)

- Framework: Next.js com App Router
- Linguagem: TypeScript (interfaces para props, respostas de API, etc.)
- Estilização: Tailwind CSS (pode usar variáveis CSS para temas)
- Ícones: lucide-react (preferencial) ou qualquer lib de ícones
- Todas as páginas: devem usar 'use client' quando necessário
- Estado: useState/useEffect para estado local. Pode usar Context para auth
- HTTP Client: Axios (instância centralizada com interceptors de auth)
- Modais: usar Modal para criar/editar (não criar páginas separadas)
- Loading: sempre mostrar estado de loading em operações assíncronas
- Responsividade: o layout deve funcionar em desktop (não precisa ser mobile-first)

Estrutura de pastas sugerida no frontend:

```
src/
app/
login/page.tsx # Página de login
admin/
layout.tsx # Layout do painel (navbar/sidebar)
dashboard/page.tsx # Dashboard com contadores
usuarios/page.tsx # CRUD de usuários
produtos/page.tsx # CRUD de produtos
components/
ui/ # Modal, Badge, Button, Input, Table...
layout/ # Navbar, Sidebar
services/
api.ts # Instância Axios com interceptors
types/
index.ts # Interfaces TypeScript
```

## 3. DEPLOY E ENTREGA

#### 3.1 REPOSITÓRIO GITHUB

- Criar um repositório público no GitHub
- Nome sugerido: desafio-minhafabrica (ou similar)
- Pode ser monorepo (backend/ + frontend/) ou dois repositórios separados
- Incluir um README.md explicando como rodar o projeto localmente
- O README deve conter: como instalar dependências, como configurar o .env, como rodar backend e
frontend
- NÃO commitar arquivos .env, node_modules ou credenciais

#### 3.2 DEPLOY (APLICAÇÃO EM PRODUÇÃO)

A aplicação deve estar acessível online via um link funcional. Sugestões de plataformas gratuitas:

```
Camada Plataforma Sugerida Alternativas
Frontend Vercel (recomendado p/ Next.js) Netlify, Railway
Backend Render, Railway Fly.io, Cyclic
Banco de Dados MongoDB Atlas (free tier) ---
```
#### 3.3 O QUE ENTREGAR

###### O QUE VOCÊ DEVE ENVIAR POR E-MAIL

1. Link do repositório GitHub
2. Link da aplicação em produção (frontend funcionando)
3. E-mail explicando o resumo de como você desenvolveu a aplicação:
- Quais tecnologias usou e por quê
- Quais foram as maiores dificuldades
- O que você faria diferente com mais tempo
- Quanto tempo levou para desenvolver
4. Credenciais de acesso do usuário admin para teste (e-mail e senha)

Enviar para: caio.basdao@minhafabrica.com

Assunto do e-mail: [Desafio Técnico] Seu Nome Completo


## 4. SOBRE O USO DE INTELIGÊNCIA ARTIFICIAL

##### O USO DE IA É PERMITIDO E ATÉ ACONSELHADO

```
Na MinhaFabrica, acreditamos que saber usar ferramentas de IA (ChatGPT, Claude, Copilot,
Cursor, etc.) é uma habilidade valiosa para qualquer desenvolvedor moderno.
```
```
Você pode e deve usar IA para te ajudar a gerar código, resolver bugs, entender conceitos e
acelerar seu desenvolvimento.
```
```
PORÉM: tudo que estiver no código, você DEVE saber explicar.
```
```
Na próxima etapa do processo seletivo, caso selecionado, haverá uma reunião onde você
precisará:
```
- Explicar o que cada parte do código faz
- Justificar as decisões técnicas tomadas
- Demonstrar que entendeu a arquitetura utilizada
- Responder perguntas sobre o funcionamento da aplicação

```
Usar IA sem entender o que foi gerado será facilmente identificado e resultará em
eliminação do processo. O objetivo é avaliar sua capacidade de aprender e compreender,
não apenas copiar e colar.
```
## 5. CRITÉRIOS DE AVALIAÇÃO

```
Critério Peso O que avaliamos
Funcionalidade 30% Tudo funciona? Login, CRUD completo, validações?
Arquitetura do Código 25% Seguiu Controller › Service › Repository › Model?
Qualidade do Código 15% Código limpo, organizado, bem nomeado?
Frontend & UX 10% Interface funcional, feedback visual, loading states?
Deploy & Documentação 10% App online, README claro, .env.example?
E-mail Explicativo 10% Clareza na comunicação, honestidade, reflexão?
```
DIFERENCIAIS (não obrigatórios, mas contam pontos):

- Paginação na listagem de usuários/produtos
- Busca/filtro na listagem
- Upload de imagem no produto
- Testes automatizados (unitários ou integração)
- Tratamento de erros centralizado no backend


- Dark mode no frontend
- Commits bem escritos e organizados (não um commit único com tudo)

## 6. DICAS E PERGUNTAS FREQUENTES

```
Nunca fiz deploy, e agora?
Sem problemas! Pesquise tutoriais de deploy no Vercel (frontend) e Render (backend). Ambos têm
planos gratuitos e documentação excelente. O MongoDB Atlas também tem free tier. Saber
pesquisar e resolver problemas faz parte da avaliação.
```
```
Posso usar bibliotecas adicionais?
Sim! Pode usar libs como bcryptjs para hash de senha, cors, multer para upload, react-hot-toast
para notificações, etc. Apenas mantenha a stack principal (Node/Express/MongoDB no back e
Next.js/React/TS/Tailwind no front).
```
```
Precisa estar bonito?
Não precisa ser um design premiado, mas deve ser funcional, limpo e agradável. Use o Tailwind
CSS para manter consistência. Lembre-se: é uma aplicação admin, não um site de marketing.
```
```
E se eu não conseguir fazer tudo?
Entregue o que conseguir! Preferimos um CRUD de produtos bem feito do que dois CRUDs mal
feitos. Qualidade sobre quantidade. O e-mail explicativo é sua chance de mostrar o que faria com
mais tempo.
```
```
Como deve ser o usuário admin inicial?
Crie um script de seed ou uma rota POST /api/v1/auth/seed que popule o banco com um usuário
admin. Inclua as credenciais no e-mail de entrega para que possamos testar. Exemplo:
admin@minhafabrica.com / senha
```
```
Posso perguntar dúvidas durante o desafio?
Este desafio é individual e parte da avaliação inclui sua capacidade de resolver problemas por conta
própria. Dúvidas sobre o enunciado podem ser enviadas para caio.basdao@minhafabrica.com, mas
não daremos suporte técnico.
```

```
Boa sorte!
```
Este desafio foi pensado para refletir o dia a dia real de trabalho na MinhaFabrica. Queremos
ver como você pensa, como organiza seu código e como resolve problemas. Não existe
resposta perfeita — existe a SUA resposta.

```
Estamos torcendo por você!
```
```
Equipe MinhaFabrica
```
```
MinhaFabrica — Processo Seletivo Abril 2026 | Londrina/PR
```

