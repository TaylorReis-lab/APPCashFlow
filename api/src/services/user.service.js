const User = require('../models/User.model');

class UserService {
  /**
   * Obter perfil do usuário
   */
  async getProfile(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletar conta do usuário
   */
  async deleteAccount(userId) {
    try {
      // Deletar também todas as entradas do usuário
      const Entry = require('../models/Entry.model');
      await Entry.deleteMany({ userId });

      // Deletar usuário
      const result = await User.deleteOne({ _id: userId });

      if (result.deletedCount === 0) {
        throw new Error('Usuário não encontrado');
      }

      return {
        message: 'Conta deletada com sucesso'
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
