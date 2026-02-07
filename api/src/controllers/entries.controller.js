// ============================================================
//  FINEXA API — Controller de Lançamentos Financeiros
// ============================================================

const entriesService = require('../services/entries.service');
const { validateEntry } = require('../validators/entry.validator');

exports.list = async (req, res) => {
  try {
    const { type, q, cardBrand, from, to, limit, offset } = req.query;
    const userId = req.user.id;

    const result = await entriesService.list(userId, {
      type,
      q,
      cardBrand,
      from,
      to,
      limit: parseInt(limit) || 100,
      offset: parseInt(offset) || 0,
    });

    res.json({
      ok: true,
      total: result.total,
      income: result.income,
      expenses: result.expenses,
      balance: result.balance,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { message: 'Erro ao listar registros.' }
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const entry = await entriesService.getById(id, userId);

    if (!entry) {
      return res.status(404).json({
        ok: false,
        error: { message: 'Registro não encontrado.' }
      });
    }

    res.json({ ok: true, data: entry });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { message: 'Erro ao buscar registro.' }
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { type, amount, description, cardBrand, category } = req.body || {};
    const userId = req.user.id;

    const validation = validateEntry({ type, amount, description, cardBrand });
    if (!validation.valid) {
      return res.status(400).json({
        ok: false,
        error: { message: validation.errors.join(' '), details: validation.errors }
      });
    }

    const newEntry = await entriesService.create(userId, {
      type,
      amount: Number(amount),
      description: description.trim(),
      cardBrand,
      category: category?.trim(),
    });

    res.status(201).json({ ok: true, data: newEntry });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { message: 'Erro ao criar registro.' }
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const updatedEntry = await entriesService.update(id, userId, updates);

    if (!updatedEntry) {
      return res.status(404).json({
        ok: false,
        error: { message: 'Registro não encontrado.' }
      });
    }

    res.json({ ok: true, data: updatedEntry });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { message: 'Erro ao atualizar registro.' }
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await entriesService.deleteById(id, userId);

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        error: { message: 'Registro não encontrado.' }
      });
    }

    res.json({
      ok: true,
      data: { id, message: 'Registro excluído com sucesso.' }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { message: 'Erro ao excluir registro.' }
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const removed = await entriesService.deleteAll(userId);

    res.json({
      ok: true,
      data: { removed, message: `${removed} registros excluídos.` }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { message: 'Erro ao excluir registros.' }
    });
  }
};

exports.seed = async (req, res) => {
  try {
    const userId = req.user.id;
    const seededCount = await entriesService.seed(userId);

    res.status(201).json({
      ok: true,
      data: { seeded: seededCount, message: `${seededCount} registros de demonstração inseridos.` }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { message: 'Erro ao inserir dados de demonstração.' }
    });
  }
};
