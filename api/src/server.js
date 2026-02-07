// ============================================================
//  CASHFLOW API — Servidor Principal
//  Sistema de Controle Financeiro Profissional
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth.routes');
const entriesRoutes = require('./routes/entries.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Conectar ao MongoDB ─────────────────────────────────────
connectDB();

// ── Middlewares Globais ─────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(morgan('dev'));

// ── Rotas ───────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'CASHFLOW API',
    version: '2.0.0',
    status: 'online',
    uptime: Math.floor(process.uptime()) + 's',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/entries', entriesRoutes);
app.use('/api/user', userRoutes);

// ── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: {
      message: 'Rota não encontrada. Consulte GET /api/health para status da API.',
    }
  });
});

// ── Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    error: {
      message: 'Erro interno do servidor.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    }
  });
});

// ── Exportar para Serverless (Vercel) / Iniciar Local ───────
if (process.env.VERCEL) {
  // Em ambiente Serverless (Vercel), exportamos a aplicação
  module.exports = app;
} else {
  // Em ambiente local ou Docker, iniciamos o servidor normalmente
  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('   💎  CASHFLOW API v2.0 — ONLINE');
    console.log(`   🌐  http://localhost:${PORT}`);
    console.log(`   📋  Health: http://localhost:${PORT}/api/health`);
    console.log('   🔐  Login:  POST /api/auth/login');
    console.log('   📝  Docs:   Leia o README.md');
    console.log('═══════════════════════════════════════════');
    console.log('');
  });
}
