# 🍃 FINEXA API — Guia MongoDB (NoSQL)

A FINEXA API utiliza **MongoDB** como banco de dados NoSQL para armazenar todos os dados de forma escalável e performática.

---

## 📊 Estrutura de Dados

### 🗄️ Collections (Tabelas)

#### 1. **users** - Usuários do Sistema

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  username: "admin",
  password: "$2a$10$hashed...", // Senha hasheada com bcrypt
  createdAt: ISODate("2024-01-15T10:00:00.000Z"),
  updatedAt: ISODate("2024-01-15T10:00:00.000Z")
}
```

**Índices:**
- `username` (único)

---

#### 2. **entries** - Lançamentos Financeiros

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"), // Referência ao usuário
  description: "Jantar no Restaurante",
  amount: 150.50,
  type: "expense", // "income" ou "expense"
  cardBrand: "mastercard", // ou null
  date: ISODate("2024-01-15T18:30:00.000Z"),
  createdAt: ISODate("2024-01-15T18:35:00.000Z"),
  updatedAt: ISODate("2024-01-15T18:35:00.000Z")
}
```

**Índices:**
- `userId` + `date` (ordenação rápida)
- `userId` + `type` (filtros rápidos)

---

## 🔧 Acessar o MongoDB

### Via Docker (Mongosh)

```bash
# Acessar o container do MongoDB
docker exec -it finexa-mongodb mongosh

# Dentro do mongosh:
use finexa

# Listar todas as collections
show collections

# Contar usuários
db.users.countDocuments()

# Contar lançamentos
db.entries.countDocuments()

# Ver todos os usuários
db.users.find().pretty()

# Ver lançamentos de um usuário específico
db.entries.find({ userId: ObjectId("507f1f77bcf86cd799439011") }).pretty()

# Ver estatísticas
db.entries.aggregate([
  {
    $group: {
      _id: "$type",
      total: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  }
])
```

---

## 📈 Queries Úteis

### Buscar usuário por username
```javascript
db.users.findOne({ username: "admin" })
```

### Buscar todos os gastos
```javascript
db.entries.find({ type: "expense" }).sort({ date: -1 })
```

### Buscar entradas por bandeira de cartão
```javascript
db.entries.find({ cardBrand: "visa" })
```

### Calcular saldo de um usuário
```javascript
db.entries.aggregate([
  {
    $match: { userId: ObjectId("507f1f77bcf86cd799439011") }
  },
  {
    $group: {
      _id: "$type",
      total: { $sum: "$amount" }
    }
  }
])
```

### Deletar todos os lançamentos de um usuário
```javascript
db.entries.deleteMany({ userId: ObjectId("507f1f77bcf86cd799439011") })
```

### Criar índices manualmente (já são criados pelo Mongoose)
```javascript
db.entries.createIndex({ userId: 1, date: -1 })
db.entries.createIndex({ userId: 1, type: 1 })
db.users.createIndex({ username: 1 }, { unique: true })
```

---

## 🔒 Segurança

### Senhas
- Todas as senhas são hasheadas com **bcrypt** (salt rounds: 10)
- Nunca são retornadas nas respostas da API

### Validações do Mongoose
- `username`: mínimo 3 caracteres, único
- `password`: mínimo 6 caracteres
- `amount`: deve ser > 0.01
- `type`: deve ser "income" ou "expense"
- `cardBrand`: enum de bandeiras válidas

---

## 📦 Backup e Restore

### Fazer backup
```bash
docker exec finexa-mongodb mongodump --db finexa --out /data/backup

# Copiar backup para host
docker cp finexa-mongodb:/data/backup ./backup
```

### Restaurar backup
```bash
# Copiar backup para container
docker cp ./backup finexa-mongodb:/data/backup

# Restaurar
docker exec finexa-mongodb mongorestore --db finexa /data/backup/finexa
```

---

## 🚀 Performance

### Índices Otimizados
A API cria automaticamente os seguintes índices:

1. **users.username** (único) → Login rápido
2. **entries.userId + entries.date** → Listagem ordenada rápida
3. **entries.userId + entries.type** → Filtros rápidos

### Queries Otimizadas
- Projeções: retorna apenas campos necessários
- Lean queries: retorna objetos JavaScript simples (mais rápido)
- Índices compostos: para queries com múltiplos filtros

---

## 🌐 MongoDB Atlas (Cloud)

Para usar MongoDB na nuvem:

1. Crie uma conta em [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Obtenha a connection string
4. Configure a variável de ambiente:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/finexa?retryWrites=true&w=majority
```

---

## 📊 Monitoramento

### Ver logs do MongoDB
```bash
docker-compose logs -f mongodb
```

### Estatísticas do banco
```javascript
db.stats()
```

### Estatísticas de uma collection
```javascript
db.entries.stats()
```

---

## 🛠️ Troubleshooting

### Erro: "MongoNetworkError"
- Verifique se o MongoDB está rodando: `docker ps`
- Verifique a connection string no `.env`

### Erro: "E11000 duplicate key"
- Já existe um documento com o mesmo valor único (ex: username)

### Performance lenta
- Verifique se os índices estão criados: `db.entries.getIndexes()`
- Analise queries lentas: `db.setProfilingLevel(1)`

---

**FINEXA API v2.0** - Powered by MongoDB 🍃
