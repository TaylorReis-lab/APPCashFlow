// ============================================================
//  FINEXA API — Rotas de Usuário
// ============================================================

const express = require('express');
const userController = require('../controllers/user.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/me', requireAuth, userController.getProfile);

module.exports = router;
