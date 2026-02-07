# 💎 CASHFLOW API v2.0

**Sistema Profissional de Controle Financeiro**  
API REST com arquitetura MVC, autenticação JWT e persistência de dados.

---

## 📂 Arquitetura do Projeto

```
api/
├── src/
│   ├── server.js                 # Servidor principal Express
│   ├── config/
│   │   └── database.js          # Configuração MongoDB
│   ├── routes/                   # Definição de rotas
│   │   ├── auth.routes.js       # Rotas de autenticação
│   │   ├── entries.routes.js    # Rotas de lançamentos
│   │   └── user.routes.js       # Rotas de usuário
│   ├── controllers/              # Controladores (lógica de requisição)
│   │   ├── auth.controller.js
│   │   ├── entries.controller.js
│   │   └── user.controller.js
│   ├── services/                 # Serviços (lógica de negócio)
│   │   ├── auth.service.js
│   │   ├── entries.service.js
│   │   └── user.service.js
│   ├── models/                   # Schemas Mongoose (NoSQL)
│   │   ├── User.model.js        # Schema de usuários
│   │   └── Entry.model.js       # Schema de lançamentos
│   ├── middlewares/              # Middlewares
│   │   └── auth.middleware.js   # Verificação JWT
│   └── validators/               # Validadores
│       └── entry.validator.js
├── package.json
├── Dockerfile
├── docker-compose.yml            # API + MongoDB
├── .env.example                  # Template variáveis
└── README.md
```

---

## 🚀 Como Rodar

### Desenvolvimento Local

**Pré-requisitos:**
- Node.js 18+
- MongoDB rodando localmente (porta 27017)

```bash
cd api
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor
npm start
```

A API estará disponível em: **http://localhost:3000**

### Com Docker (Recomendado)

```bash
cd api
docker-compose up --build -d
```

Isso vai subir **2 containers**:
- `cashflow-mongodb`: Banco de dados NoSQL
- `cashflow-api`: Servidor Node.js

**Ver logs:**
```bash
docker-compose logs -f api
```

**Parar:**
```bash
docker-compose down
```

**Limpar volumes (apaga dados):**
```bash
docker-compose down -v
```

---

## 🔐 Autenticação

Todas as rotas (exceto `/api/health`, `/api/auth/login` e `/api/auth/register`) exigem autenticação via **JWT**.

**Header obrigatório:**
```
Authorization: Bearer <seu_token>
```

**Credenciais padrão:**
- Usuário: `admin`
- Senha: `admin123`

---

## 📋 Endpoints da API

### Públicos (sem autenticação)

| Método | Rota                | Descrição           |
|--------|---------------------|---------------------|
| GET    | `/api/health`       | Status da API       |
| POST   | `/api/auth/login`   | Login (obter token) |
| POST   | `/api/auth/register`| Registrar usuário   |

### Protegidos (com Bearer Token)

| Método | Rota                  | Descrição                    |
|--------|-----------------------|------------------------------|
| GET    | `/api/user/me`        | Perfil do usuário logado     |
| GET    | `/api/entries`        | Listar lançamentos (filtros) |
| GET    | `/api/entries/:id`    | Buscar lançamento por ID     |
| POST   | `/api/entries`        | Criar novo lançamento        |
| PUT    | `/api/entries/:id`    | Atualizar lançamento         |
| DELETE | `/api/entries/:id`    | Excluir lançamento           |
| DELETE | `/api/entries`        | Excluir todos os lançamentos |
| POST   | `/api/entries/seed`   | Inserir dados demo           |

---

## 🧪 Exemplos de Requisições (Insomnia/Postman)

### 1. Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "username": "admin",
    "name": "Administrador"
  }
}
```

### 2. Criar Lançamento
```http
POST http://localhost:3000/api/entries
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "gasto",
  "amount": 150.50,
  "description": "Jantar Especial",
  "cardBrand": "Mastercard"
}
```

### 3. Listar Lançamentos (com filtros)
```http
GET http://localhost:3000/api/entries?type=gasto&q=jantar&limit=10
Authorization: Bearer <token>
```

### 4. Registrar Novo Usuário
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "maria",
  "password": "senha123",
  "name": "Maria Silva"
}
```

---

## 🌐 Bandeiras de Cartão Aceitas

`Visa` | `Mastercard` | `Elo` | `American Express` | `Hipercard` | `Discover` | `Diners` | `Outra`

---

## 🛡️ Segurança

- **Helmet.js:** Proteção contra vulnerabilidades comuns
- **CORS:** Configurado para aceitar requisições de qualquer origem
- **JWT:** Tokens criptografados com validade de 7 dias
- **Bcrypt:** Senhas hasheadas com salt de 10 rounds

---

## ☁️ Deploy na Nuvem

### AWS / DigitalOcean / VPS
1. Suba a pasta `/api` para seu servidor
2. Configure as variáveis de ambiente (`.env`)
3. Execute `docker-compose up --build -d`

### Render / Railway / Fly.io
1. Aponte o deploy para a pasta `/api`
2. Configure `PORT=3000` e `JWT_SECRET` nas variáveis
3. Deploy automático!

---

## 📊 Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/cashflow
JWT_SECRET=sua-chave-super-secreta-mude-isso
JWT_EXPIRES_IN=7d
```

---

## 🧑‍💻 Desenvolvido com

- **Node.js** + **Express**
- **MongoDB** + **Mongoose** (NoSQL Database)
- **JWT** para autenticação
- **Bcrypt** para criptografia de senhas
- **Helmet** para segurança HTTP
- **Morgan** para logs de requisições
- **Arquitetura MVC** profissional

---

## 📄 Licença

MIT License - CASHFLOW © 2024
