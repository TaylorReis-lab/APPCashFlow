// ============================================================
//  FINEXA API — Rotas de Lançamentos Financeiros
// ============================================================

const express = require('express');
const entriesController = require('../controllers/entries.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(requireAuth);

router.get('/', entriesController.list);
router.get('/:id', entriesController.getById);
router.post('/', entriesController.create);
router.put('/:id', entriesController.update);
router.delete('/:id', entriesController.deleteById);
router.delete('/', entriesController.deleteAll);
router.post('/seed', entriesController.seed);

module.exports = router;
