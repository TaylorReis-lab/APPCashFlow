# 🏗️ Arquitetura do Sistema CashFlow

Documentação completa da arquitetura do sistema de controle financeiro **CashFlow**.

---

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    CashFlow SYSTEM v2.0                       │
│          Sistema de Controle Financeiro Profissional       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼────────┐          ┌──────▼───────┐
        │   FRONTEND     │          │   BACKEND    │
        │   (React App)  │◄────────►│  (Node API)  │
        │   Port: 443    │   HTTPS  │  Port: 3000  │
        └────────────────┘   REST   └──────────────┘
                │                           │
         ┌──────┴──────┐            ┌──────┴──────┐
         │             │            │             │
    ┌────▼────┐   ┌───▼───┐   ┌───▼───┐   ┌────▼─────┐
    │ Docker  │   │ Nginx │   │Express│   │  Docker  │
    │Container│   │ HTTPS │   │  JWT  │   │ Container│
    └─────────┘   └───────┘   └───────┘   └──────────┘
                                               │
                                        ┌──────▼──────┐
                                        │ Persistência│
                                        │   (JSON)    │
                                        │   Volume    │
                                        └─────────────┘
```

---

## 🗂️ Estrutura de Diretórios

```
CashFlow/
│
├── 📱 APP (FRONTEND)
│   ├── src/
│   │   ├── App.tsx                    # Componente raiz
│   │   ├── main.tsx                   # Entry point
│   │   ├── index.css                  # Estilos globais
│   │   │
│   │   ├── components/                # Componentes reutilizáveis
│   │   │   ├── Login.tsx             # Tela de login/registro
│   │   │   ├── Field.tsx             # Inputs customizados
│   │   │   └── JsonBlock.tsx         # Visualizador JSON
│   │   │
│   │   ├── views/                     # Telas/Pages
│   │   │   ├── Dashboard.tsx         # Painel principal
│   │   │   ├── AddEntry.tsx          # Novo lançamento
│   │   │   ├── History.tsx           # Extrato/Histórico
│   │   │   └── SettingsView.tsx      # Configurações
│   │   │
│   │   ├── lib/                       # Bibliotecas
│   │   │   └── api.ts                # Client HTTP (fetch)
│   │   │
│   │   ├── types.ts                   # TypeScript Types
│   │   └── utils/
│   │       └── cn.ts                  # Utilitários (classnames)
│   │
│   ├── public/                        # Assets estáticos
│   ├── index.html                     # HTML template
│   ├── package.json                   # Dependências frontend
│   ├── tsconfig.json                  # Config TypeScript
│   ├── vite.config.ts                 # Config Vite
│   ├── tailwind.config.js             # Config Tailwind
│   ├── Dockerfile                     # Container frontend
│   ├── nginx.conf                     # Config Nginx HTTPS
│   ├── docker-compose.yml             # Orquestração frontend
│   └── README.md                      # Docs do app
│
├── 🔌 API (BACKEND)
│   ├── src/
│   │   ├── server.js                  # Servidor Express
│   │   │
│   │   ├── routes/                    # Definição de rotas
│   │   │   ├── auth.routes.js        # POST /api/auth/login, register
│   │   │   ├── entries.routes.js     # CRUD /api/entries
│   │   │   └── user.routes.js        # GET /api/user/me
│   │   │
│   │   ├── controllers/               # Controladores (HTTP handlers)
│   │   │   ├── auth.controller.js    # Login, register
│   │   │   ├── entries.controller.js # CRUD entries
│   │   │   └── user.controller.js    # Perfil do usuário
│   │   │
│   │   ├── services/                  # Lógica de negócio
│   │   │   ├── auth.service.js       # JWT, bcrypt
│   │   │   ├── entries.service.js    # Regras de negócio
│   │   │   └── user.service.js       # Lógica de usuário
│   │   │
│   │   ├── models/                    # Acesso a dados (DAO)
│   │   │   ├── user.model.js         # CRUD users.json
│   │   │   └── entry.model.js        # CRUD entries.json
│   │   │
│   │   ├── middlewares/               # Middlewares
│   │   │   └── auth.middleware.js    # requireAuth (JWT)
│   │   │
│   │   └── validators/                # Validadores
│   │       └── entry.validator.js    # Validação de entrada
│   │
│   ├── data/                          # Persistência (auto-gerado)
│   │   ├── users.json                # Banco de usuários
│   │   └── entries.json              # Banco de lançamentos
│   │
│   ├── package.json                   # Dependências backend
│   ├── Dockerfile                     # Container backend
│   ├── docker-compose.yml             # Orquestração backend
│   ├── .env.example                   # Variáveis de ambiente
│   ├── .dockerignore                  # Arquivos ignorados
│   ├── README.md                      # Docs da API
│   └── INSOMNIA_GUIDE.md             # Guia de testes
│
└── 📄 DOCS
    ├── README.md                      # Documentação principal
    └── ARCHITECTURE.md                # Este arquivo
```

---

## 🔄 Fluxo de Dados

### 1. Autenticação (Login)

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│          │                │          │                │          │
│  CLIENT  │────Login──────►│   API    │────Query──────►│  Model   │
│ (React)  │   (POST)       │ (Express)│    (JSON)      │ (users)  │
│          │                │          │                │          │
│          │◄───Token───────│          │◄───User────────│          │
│          │   (JWT)        │          │                │          │
└──────────┘                └──────────┘                └──────────┘
     │
     │ (Armazena token)
     ▼
localStorage
"CashFlow_api_token"
```

### 2. Criar Lançamento

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│          │                │          │                │          │
│  CLIENT  │────POST────────►│Middleware│───Validate────►│Controller│
│          │ + Bearer Token │  (Auth)  │                │          │
│          │                │          │                │          │
└──────────┘                └──────────┘                └────┬─────┘
                                                              │
                                                              ▼
                                                        ┌──────────┐
                                                        │ Service  │
                                                        │(Business)│
                                                        └────┬─────┘
                                                             │
                                                             ▼
                                                        ┌──────────┐
                                                        │  Model   │
                                                        │ (Write)  │
                                                        └────┬─────┘
                                                             │
                                                             ▼
                                                       entries.json
```

### 3. Listar com Filtros

```
CLIENT ──GET /api/entries?type=gasto&q=restaurante──► API
   ▲                                                     │
   │                                                     ▼
   │                                              ┌─────────────┐
   │                                              │ Controller  │
   │                                              │   (Parse    │
   │                                              │   Filters)  │
   │                                              └──────┬──────┘
   │                                                     │
   │                                                     ▼
   │                                              ┌─────────────┐
   │                                              │  Service    │
   │                                              │  (Filter    │
   │                                              │   Logic)    │
   │                                              └──────┬──────┘
   │                                                     │
   │                                                     ▼
   │                                              ┌─────────────┐
   │                                              │   Model     │
   │                                              │  (Read All) │
   │                                              └──────┬──────┘
   │                                                     │
   │                                                     ▼
   │                                              ┌─────────────┐
   │                                              │entries.json │
   │                                              └──────┬──────┘
   │                                                     │
   └──────────── JSON Response ◄────────────────────────┘
   { ok, total, income, expenses, balance, data[] }
```

---

## 🛡️ Camadas de Segurança

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: HTTPS (Nginx SSL)                            │
│  • Certificado autoassinado (dev)                      │
│  • TLS 1.2 / 1.3                                       │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 2: CORS (Express)                               │
│  • Origem permitida configurável                       │
│  • Headers autorizados                                 │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: Helmet.js                                    │
│  • Proteção XSS                                        │
│  • Content Security Policy                            │
│  • HSTS, X-Frame-Options, etc                         │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 4: JWT Authentication                           │
│  • Bearer Token obrigatório                            │
│  • Validade: 7 dias (configurável)                    │
│  • Secret key (env variable)                          │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 5: Bcrypt (Passwords)                           │
│  • Hash com salt rounds = 10                          │
│  • Senhas nunca armazenadas em plain text            │
└─────────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 6: Data Isolation                               │
│  • Cada usuário vê apenas seus dados (userId filter)  │
│  • Validação de propriedade em todas as operações    │
└─────────────────────────────────────────────────────────┘
```

---

## 🐳 Containers Docker

### Frontend Container

```dockerfile
┌─────────────────────────────────────┐
│  FROM node:20-alpine (Build Stage) │
│  ├─ npm install                     │
│  ├─ npm run build                   │
│  └─ Gera /dist                      │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  FROM nginx:alpine (Serve Stage)    │
│  ├─ Copia /dist → /usr/share/nginx  │
│  ├─ Configura nginx.conf            │
│  ├─ Gera SSL cert autoassinado      │
│  └─ EXPOSE 80, 443                  │
└─────────────────────────────────────┘
```

### Backend Container

```dockerfile
┌─────────────────────────────────────┐
│  FROM node:20-alpine                │
│  ├─ npm install --production        │
│  ├─ Copia src/                      │
│  ├─ VOLUME /app/data                │
│  ├─ ENV PORT=3000                   │
│  ├─ HEALTHCHECK /api/health         │
│  └─ CMD node src/server.js          │
└─────────────────────────────────────┘
```

---

## 📦 Tecnologias Utilizadas

### Frontend

| Tecnologia   | Versão  | Uso                |
| ------------ | ------- | ------------------ |
| React        | 19.2.3  | UI Library         |
| TypeScript   | 5.9.3   | Type Safety        |
| Vite         | 7.2.4   | Build Tool         |
| Tailwind CSS | 4.1.17  | Styling            |
| Lucide React | 0.563.0 | Ícones             |
| Nginx        | alpine  | Web Server + HTTPS |

### Backend

| Tecnologia | Versão | Uso                         |
| ---------- | ------ | --------------------------- |
| Node.js    | 20     | Runtime                     |
| Express    | 4.18.2 | Framework Web               |
| JWT        | 9.0.2  | Autenticação                |
| Bcrypt     | 2.4.3  | Hash de senhas              |
| Helmet     | 7.1.0  | Segurança HTTP              |
| Morgan     | 1.10.0 | Logger                      |
| CORS       | 2.8.5  | Cross-Origin Resource Share |

---

## 🚀 Deploy

### Desenvolvimento Local

```bash
# Terminal 1 - Backend
cd api
npm install
npm start
# → http://localhost:3000

# Terminal 2 - Frontend
npm install
npm run dev
# → http://localhost:5173
```

### Produção com Docker

```bash
# Backend (separado)
cd api
docker-compose up --build -d
# → http://localhost:3000

# Frontend (separado)
docker-compose up --build -d
# → https://localhost (porta 443)
```

### Cloud Deploy

#### Backend (Railway / Render)

1. Push pasta `/api` para Git
2. Configurar variáveis:
   - `PORT=3000`
   - `JWT_SECRET=sua-chave-aqui`
3. Deploy automático

#### Frontend (Vercel / Netlify)

1. Push raiz do projeto
2. Build command: `npm run build`
3. Output directory: `dist`
4. Env var: `VITE_API_URL=https://sua-api.com/api`

---

## 🔧 Variáveis de Ambiente

### Backend (`.env`)

```env
PORT=3000
JWT_SECRET=CashFlow-super-secret-key-2024
JWT_EXPIRES=7d
NODE_ENV=production
```

### Frontend (`.env`)

```env
VITE_API_URL=https://api.CashFlow.com/api
```

---

## 📊 Modelo de Dados

### User

```typescript
{
  id: string,              // UUID v4
  username: string,        // Único
  password: string,        // Hash bcrypt
  name: string,
  createdAt: string        // ISO 8601
}
```

### Entry

```typescript
{
  id: string,              // UUID v4
  userId: string,          // FK → User
  createdAt: string,       // ISO 8601
  updatedAt?: string,      // ISO 8601
  type: "gasto" | "entrada",
  amount: number,          // Decimal (2 casas)
  description: string,
  cardBrand?: string,      // Visa, Mastercard, etc
  category?: string        // Opcional
}
```

---

## 🎯 Próximas Features (Roadmap)

- [ ] PostgreSQL / MongoDB (substituir JSON)
- [ ] Categorias fixas com ícones
- [ ] Gráficos e relatórios (Chart.js)
- [ ] Exportação CSV/PDF
- [ ] Multi-tenancy (empresas)
- [ ] Notificações push
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados (Jest/Vitest)
- [ ] CI/CD (GitHub Actions)

---

**CashFlow v2.0** - Arquitetura Profissional de Controle Financeiro 💎
