// ============================================================
//  FINEXA API — Controller de Autenticação
// ============================================================

const authService = require('../services/auth.service');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        error: { message: 'Campos username e password são obrigatórios.' }
      });
    }

    const result = await authService.login(username, password);

    if (!result.success) {
      return res.status(401).json({
        ok: false,
        error: { message: result.error }
      });
    }

    res.json({
      ok: true,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { message: 'Erro ao processar login.' }
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, name } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        error: { message: 'Campos username e password são obrigatórios.' }
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        error: { message: 'A senha deve ter pelo menos 6 caracteres.' }
      });
    }

    const result = await authService.register(username, password, name);

    if (!result.success) {
      return res.status(409).json({
        ok: false,
        error: { message: result.error }
      });
    }

    res.status(201).json({
      ok: true,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { message: 'Erro ao criar conta.' }
    });
  }
};
