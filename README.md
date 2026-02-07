# 💎 CASHFLOW — Sistema de Controle Financeiro Profissional

Projeto fullstack com **App Mobile** (React) e **API REST** (Node.js/Express) **100% separados**, cada um com arquitetura profissional e Docker.

---

## 📁 Estrutura do Projeto

```
/
├── api/                      ← 🔌 CASHFLOW API (Backend Isolado - Arquitetura MVC)
│   ├── src/
│   │   ├── server.js         │  Servidor Express principal
│   │   ├── routes/           │  Definição de rotas
│   │   ├── controllers/      │  Controladores (lógica de requisição)
│   │   ├── services/         │  Serviços (lógica de negócio)
│   │   ├── models/           │  Modelos (acesso a dados)
│   │   ├── middlewares/      │  Middlewares (autenticação, etc)
│   │   └── validators/       │  Validadores de entrada
│   ├── package.json          │  Dependências do backend
│   ├── Dockerfile            │  Container Docker da API
│   ├── docker-compose.yml    │  Orquestração isolada
│   ├── .env.example          │  Variáveis de ambiente
│   ├── README.md             │  Documentação completa da API
│   └── data/                 │  Dados persistidos (auto-gerado)
│       ├── entries.json      │
│       └── users.json        │
│
├── src/                      ← 📱 APP (Frontend Isolado)
│   ├── App.tsx               │  Componente principal
│   ├── main.tsx              │  Entrypoint
│   ├── lib/api.ts            │  Client HTTP para a API
│   ├── types.ts              │  Tipos TypeScript
│   ├── components/           │  Componentes reutilizáveis
│   │   ├── Login.tsx         │
│   │   ├── Field.tsx         │
│   │   └── JsonBlock.tsx     │
│   └── views/                │  Telas do App
│       ├── Dashboard.tsx     │
│       ├── AddEntry.tsx      │
│       ├── History.tsx       │
│       └── SettingsView.tsx  │
│
├── Dockerfile                ← Container Docker do App
├── docker-compose.yml        ← Orquestração do App
├── nginx.conf                ← Config HTTPS do Nginx
├── package.json              ← Dependências do frontend
└── README.md                 ← Este arquivo
```

---

## 🚀 Como Rodar

### 1. Subir a API (Backend)

```bash
cd api
npm install
npm start
# API rodando em http://localhost:3000
```

### 2. Subir o App (Frontend)

```bash
# Na raiz do projeto
npm install
npm run dev
# App rodando em http://localhost:5173
```

---

## 🐳 Deploy com Docker

### Subir a API:
```bash
cd api
docker-compose up --build -d
# API rodando em http://localhost:3000
```

### Subir o App:
```bash
# Na raiz do projeto
docker-compose up --build -d
# App rodando em https://localhost (porta 443)
```

---

## 🧪 Testar no Insomnia

Consulte o arquivo **`api/README.md`** para ver todos os endpoints e exemplos de requisições.

**Credenciais padrão:** `admin` / `admin123`

---

## ☁️ Deploy na Nuvem

Como API e App são **containers separados**, você pode:

- Subir a API no **Render / Railway / AWS ECS**
- Subir o App no **Vercel / Netlify / AWS S3+CloudFront**
- Ou subir ambos em uma **VPS** com Docker

Basta alterar `VITE_API_URL` no App para apontar para sua API na nuvem.
