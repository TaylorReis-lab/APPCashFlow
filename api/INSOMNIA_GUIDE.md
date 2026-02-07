# 🧪 Guia de Testes no Insomnia - CASHFLOW API

Este guia contém todos os exemplos de requisições para testar a **CASHFLOW API** no Insomnia ou Postman.

---

## ⚙️ Configuração Inicial

### 1. Iniciar a API

```bash
cd api
npm install
npm start
```

A API estará rodando em: `http://localhost:3000`

### 2. Criar um Environment no Insomnia (Opcional)

```json
{
  "base_url": "http://localhost:3000/api",
  "token": ""
}
```

---

## 📋 Coleção de Requisições

### 🟢 1. Health Check (Status da API)

**Sem autenticação**

```http
GET http://localhost:3000/api/health
```

**Resposta esperada:**
```json
{
  "ok": true,
  "service": "FINEXA API",
  "version": "2.0.0",
  "status": "online",
  "uptime": "145s",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 🔐 2. Login (Obter Token)

**Sem autenticação**

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Resposta esperada:**
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "admin",
    "name": "Administrador"
  }
}
```

**⚠️ IMPORTANTE:** Copie o valor do campo `token` e use-o nas próximas requisições!

---

### 🆕 3. Registrar Novo Usuário

**Sem autenticação**

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "joao",
  "password": "senha123",
  "name": "João Silva"
}
```

**Resposta esperada:**
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "username": "joao",
    "name": "João Silva"
  }
}
```

---

### 👤 4. Meu Perfil

**Requer autenticação**

```http
GET http://localhost:3000/api/user/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta esperada:**
```json
{
  "ok": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "admin",
    "name": "Administrador",
    "createdAt": "2024-01-10T08:00:00.000Z"
  }
}
```

---

### 💰 5. Criar Lançamento (Gasto)

**Requer autenticação**

```http
POST http://localhost:3000/api/entries
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "type": "gasto",
  "amount": 150.50,
  "description": "Jantar no Restaurante",
  "cardBrand": "Mastercard",
  "category": "Alimentação"
}
```

**Resposta esperada:**
```json
{
  "ok": true,
  "data": {
    "id": "750e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "type": "gasto",
    "amount": 150.5,
    "description": "Jantar no Restaurante",
    "cardBrand": "Mastercard",
    "category": "Alimentação"
  }
}
```

---

### 💵 6. Criar Lançamento (Entrada)

**Requer autenticação**

```http
POST http://localhost:3000/api/entries
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "type": "entrada",
  "amount": 5200.00,
  "description": "Salário Mensal",
  "category": "Renda"
}
```

---

### 📊 7. Listar Todos os Lançamentos

**Requer autenticação**

```http
GET http://localhost:3000/api/entries
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta esperada:**
```json
{
  "ok": true,
  "total": 25,
  "income": 6150.00,
  "expenses": 1245.90,
  "balance": 4904.10,
  "data": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440002",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-01-15T10:35:00.000Z",
      "type": "gasto",
      "amount": 150.5,
      "description": "Jantar no Restaurante",
      "cardBrand": "Mastercard",
      "category": "Alimentação"
    },
    // ... mais registros
  ]
}
```

---

### 🔍 8. Listar com Filtros

**Requer autenticação**

#### Filtrar por Tipo (somente gastos)
```http
GET http://localhost:3000/api/entries?type=gasto
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Filtrar por Busca Textual
```http
GET http://localhost:3000/api/entries?q=jantar
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Filtrar por Bandeira do Cartão
```http
GET http://localhost:3000/api/entries?cardBrand=Visa
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Combinar Filtros + Paginação
```http
GET http://localhost:3000/api/entries?type=gasto&q=restaurante&cardBrand=Mastercard&limit=10&offset=0
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 🔎 9. Buscar Lançamento por ID

**Requer autenticação**

```http
GET http://localhost:3000/api/entries/750e8400-e29b-41d4-a716-446655440002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta esperada:**
```json
{
  "ok": true,
  "data": {
    "id": "750e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "type": "gasto",
    "amount": 150.5,
    "description": "Jantar no Restaurante",
    "cardBrand": "Mastercard",
    "category": "Alimentação"
  }
}
```

---

### ✏️ 10. Atualizar Lançamento

**Requer autenticação**

```http
PUT http://localhost:3000/api/entries/750e8400-e29b-41d4-a716-446655440002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "amount": 180.00,
  "description": "Jantar Especial no Restaurante Italiano"
}
```

**Resposta esperada:**
```json
{
  "ok": true,
  "data": {
    "id": "750e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z",
    "type": "gasto",
    "amount": 180.0,
    "description": "Jantar Especial no Restaurante Italiano",
    "cardBrand": "Mastercard",
    "category": "Alimentação"
  }
}
```

---

### 🗑️ 11. Excluir Lançamento

**Requer autenticação**

```http
DELETE http://localhost:3000/api/entries/750e8400-e29b-41d4-a716-446655440002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta esperada:**
```json
{
  "ok": true,
  "data": {
    "id": "750e8400-e29b-41d4-a716-446655440002",
    "message": "Registro excluído com sucesso."
  }
}
```

---

### 🧹 12. Excluir TODOS os Lançamentos do Usuário

**⚠️ CUIDADO: Esta ação é irreversível!**

**Requer autenticação**

```http
DELETE http://localhost:3000/api/entries
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta esperada:**
```json
{
  "ok": true,
  "data": {
    "removed": 15,
    "message": "15 registros excluídos."
  }
}
```

---

### 🎲 13. Inserir Dados de Demonstração (Seed)

**Requer autenticação**

```http
POST http://localhost:3000/api/entries/seed
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta esperada:**
```json
{
  "ok": true,
  "data": {
    "seeded": 8,
    "message": "8 registros de demonstração inseridos."
  }
}
```

---

## 🌐 Bandeiras de Cartão Aceitas

- `Visa`
- `Mastercard`
- `Elo`
- `American Express`
- `Hipercard`
- `Discover`
- `Diners`
- `Outra`

---

## ❌ Exemplos de Erros

### Erro 401 - Não Autenticado
```json
{
  "ok": false,
  "error": {
    "message": "Token não fornecido. Faça login em POST /api/auth/login"
  }
}
```

### Erro 400 - Validação
```json
{
  "ok": false,
  "error": {
    "message": "'amount' deve ser um número > 0. 'description' é obrigatório.",
    "details": [
      "'amount' deve ser um número > 0.",
      "'description' é obrigatório."
    ]
  }
}
```

### Erro 404 - Não Encontrado
```json
{
  "ok": false,
  "error": {
    "message": "Registro não encontrado."
  }
}
```

---

## 💡 Dicas para Insomnia

1. **Criar um Environment:**
   - Base URL: `http://localhost:3000/api`
   - Token: `<será preenchido após login>`

2. **Usar variáveis:**
   - `{{ _.base_url }}/auth/login`
   - `Bearer {{ _.token }}`

3. **Organizar em pastas:**
   - 📁 Auth (login, register)
   - 📁 User (me)
   - 📁 Entries (list, create, update, delete)

4. **Chain Requests:**
   - Configure o Insomnia para extrair o token automaticamente após o login e usar nas próximas requisições.

---

## 🚀 Próximos Passos

Após testar todas as rotas no Insomnia, você pode:

1. **Integrar com o App Mobile** (já configurado em `/src`)
2. **Fazer deploy da API** via Docker
3. **Adicionar novas funcionalidades** (categorias, anexos, relatórios, etc)

---

**CASHFLOW API v2.0** - Sistema de Controle Financeiro Profissional 💎
