# 🚀 FINEXA - Guia de Início Rápido

Siga este guia para ter o **FINEXA** rodando em minutos!

---

## ⚡ Opção 1: Desenvolvimento Local (Mais Rápido)

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/finexa.git
cd finexa
```

### 2️⃣ Iniciar o Backend (API)

```bash
cd api
npm install
npm start
```

✅ **API rodando em:** `http://localhost:3000`

**Credenciais padrão:**
- Usuário: `admin`
- Senha: `admin123`

### 3️⃣ Iniciar o Frontend (App)

Em outro terminal:

```bash
# Voltar para a raiz do projeto
cd ..

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

✅ **App rodando em:** `http://localhost:5173`

### 4️⃣ Acessar o App

1. Abra `http://localhost:5173` no navegador
2. Faça login com `admin` / `admin123`
3. Pronto! 🎉

---

## 🐳 Opção 2: Com Docker (Produção)

### Pré-requisitos

- Docker
- Docker Compose

### 1️⃣ Subir o Backend

```bash
cd api
docker-compose up --build -d
```

✅ API rodando em: `http://localhost:3000`

### 2️⃣ Subir o Frontend

```bash
cd ..
docker-compose up --build -d
```

✅ App rodando em: `https://localhost` (porta 443)

**⚠️ Nota:** O navegador vai avisar sobre certificado SSL não confiável (é autoassinado). Aceite para continuar.

### 3️⃣ Ver Logs

```bash
# Logs do backend
cd api && docker-compose logs -f

# Logs do frontend
docker-compose logs -f
```

### 4️⃣ Parar os Containers

```bash
# Backend
cd api && docker-compose down

# Frontend
docker-compose down
```

---

## 🧪 Testar a API no Insomnia/Postman

### 1. Fazer Login

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
  "user": { ... }
}
```

### 2. Criar um Lançamento

```http
POST http://localhost:3000/api/entries
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "type": "gasto",
  "amount": 50.00,
  "description": "Almoço",
  "cardBrand": "Visa"
}
```

### 3. Listar Lançamentos

```http
GET http://localhost:3000/api/entries
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

📖 **Mais exemplos:** Veja `api/INSOMNIA_GUIDE.md`

---

## 📱 Usar o App Mobile

### No navegador do desktop:

1. Acesse `http://localhost:5173`
2. Abra o DevTools (F12)
3. Ative o **modo responsivo** (Ctrl+Shift+M)
4. Escolha um dispositivo (iPhone 14, Galaxy S21, etc)

### No celular real (mesma rede Wi-Fi):

1. Descubra o IP do seu computador:
   ```bash
   # Linux/Mac
   ifconfig | grep inet
   
   # Windows
   ipconfig
   ```

2. No celular, acesse:
   ```
   http://SEU_IP:5173
   ```

3. Exemplo: `http://192.168.1.100:5173`

**⚠️ Importante:** Altere a URL da API em `.env`:
```env
VITE_API_URL=http://SEU_IP:3000/api
```

---

## 🛠️ Comandos Úteis

### Frontend

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
```

### Backend

```bash
cd api
npm start            # Produção
npm run dev          # Desenvolvimento (auto-reload)
```

### Docker

```bash
# Backend
cd api
docker-compose up -d              # Subir
docker-compose down               # Parar
docker-compose logs -f            # Ver logs
docker-compose restart            # Reiniciar

# Frontend
docker-compose up -d              # Subir
docker-compose down               # Parar
```

---

## 🔧 Configuração Personalizada

### Alterar porta da API

Edite `api/.env`:
```env
PORT=5000
```

### Alterar URL da API no App

Edite `.env` na raiz:
```env
VITE_API_URL=http://localhost:5000/api
```

### Alterar chave JWT

Edite `api/.env`:
```env
JWT_SECRET=minha-chave-super-secreta
```

### Alterar tempo de expiração do token

Edite `api/.env`:
```env
JWT_EXPIRES=30d
```

---

## 📂 Estrutura de Pastas

```
finexa/
├── api/                    ← Backend (Node.js)
│   ├── src/               ← Código-fonte
│   ├── data/              ← Dados persistidos
│   └── package.json
│
├── src/                    ← Frontend (React)
│   ├── components/
│   ├── views/
│   └── lib/
│
├── dist/                   ← Build do frontend
└── package.json
```

---

## 🎯 Próximos Passos

### 1. Explorar o App
- ✅ Criar lançamentos de entrada e gastos
- ✅ Filtrar por tipo, data, bandeira
- ✅ Ver dashboard com saldo total
- ✅ Inserir dados de demonstração

### 2. Testar a API
- 📖 Leia `api/INSOMNIA_GUIDE.md`
- 🧪 Teste todos os endpoints
- 🔐 Experimente criar novos usuários

### 3. Customizar
- 🎨 Altere cores em `tailwind.config.js`
- 📊 Adicione novas features
- 🌐 Faça deploy na nuvem

---

## ❓ Solução de Problemas

### "Cannot connect to API"

✅ **Verifique:**
1. A API está rodando? (`http://localhost:3000/api/health`)
2. A porta 3000 está livre?
3. O firewall está bloqueando?

### "Token inválido"

✅ **Faça:**
1. Logout no app
2. Login novamente
3. O token expira em 7 dias (padrão)

### "Port already in use"

✅ **Solução:**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Docker não inicia

✅ **Verifique:**
1. Docker está instalado e rodando?
   ```bash
   docker --version
   docker-compose --version
   ```
2. Tem permissão de execução?
   ```bash
   sudo chmod +x docker-compose.yml
   ```

---

## 📚 Documentação Completa

- **README.md** - Visão geral do projeto
- **ARCHITECTURE.md** - Arquitetura detalhada
- **api/README.md** - Documentação da API
- **api/INSOMNIA_GUIDE.md** - Guia de testes da API

---

## 🤝 Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License - FINEXA © 2024

---

## 💬 Suporte

- 📧 Email: suporte@finexa.com
- 💬 Discord: discord.gg/finexa
- 🐛 Issues: github.com/seu-usuario/finexa/issues

---

**Bem-vindo ao FINEXA! 💎**

Desenvolvido com ❤️ usando React, Node.js e Docker.
