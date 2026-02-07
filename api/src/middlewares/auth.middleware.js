const authService = require('../services/auth.service');

/**
 * Middleware para verificar autenticação JWT
 */
const authenticateToken = (req, res, next) => {
  try {
    // Extrair token do header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        ok: false,
        error: {
          message: 'Token de autenticação não fornecido',
          code: 'NO_TOKEN'
        }
      });
    }

    // Verificar token
    const decoded = authService.verifyToken(token);

    // Adicionar dados do usuário à requisição
    req.user = {
      userId: decoded.userId,
      username: decoded.username
    };

    next();
  } catch (error) {
    return res.status(403).json({
      ok: false,
      error: {
        message: 'Token inválido ou expirado',
        code: 'INVALID_TOKEN'
      }
    });
  }
};

module.exports = { authenticateToken };
