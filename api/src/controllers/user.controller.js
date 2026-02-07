// ============================================================
//  FINEXA API — Controller de Usuário
// ============================================================

const userService = require('../services/user.service');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.getProfile(userId);

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: { message: 'Usuário não encontrado.' }
      });
    }

    res.json({ ok: true, data: user });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { message: 'Erro ao buscar perfil.' }
    });
  }
};
