const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const JWT_SECRET = process.env.JWT_SECRET || 'cashflow-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

class AuthService {
  /**
   * Registrar novo usuário
   */
  async register(username, password) {
    try {
      // Verificar se usuário já existe
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error('Usuário já existe');
      }

      // Criar novo usuário
      const user = new User({ username, password });
      await user.save();

      // Gerar token
      const token = this.generateToken(user._id, username);

      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login de usuário
   */
  async login(username, password) {
    try {
      // Buscar usuário
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Verificar senha
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Credenciais inválidas');
      }

      // Gerar token
      const token = this.generateToken(user._id, username);

      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gerar JWT Token
   */
  generateToken(userId, username) {
    return jwt.sign(
      { userId, username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  /**
   * Verificar JWT Token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
}

module.exports = new AuthService();
