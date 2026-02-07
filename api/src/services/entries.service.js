const Entry = require('../models/Entry.model');

class EntriesService {
  /**
   * Listar todas as entradas do usuário
   */
  async getAllEntries(userId, filters = {}) {
    try {
      const query = { userId };

      // Filtrar por tipo (income ou expense)
      if (filters.type && ['income', 'expense'].includes(filters.type)) {
        query.type = filters.type;
      }

      const entries = await Entry.find(query)
        .sort({ date: -1, createdAt: -1 })
        .lean();

      return entries.map(entry => ({
        id: entry._id.toString(),
        description: entry.description,
        amount: entry.amount,
        type: entry.type,
        cardBrand: entry.cardBrand || undefined,
        date: entry.date,
        createdAt: entry.createdAt
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar entrada por ID
   */
  async getEntryById(userId, entryId) {
    try {
      const entry = await Entry.findOne({ _id: entryId, userId });
      
      if (!entry) {
        throw new Error('Entrada não encontrada');
      }

      return {
        id: entry._id.toString(),
        description: entry.description,
        amount: entry.amount,
        type: entry.type,
        cardBrand: entry.cardBrand || undefined,
        date: entry.date,
        createdAt: entry.createdAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Criar nova entrada
   */
  async createEntry(userId, entryData) {
    try {
      const entry = new Entry({
        userId,
        description: entryData.description,
        amount: entryData.amount,
        type: entryData.type,
        cardBrand: entryData.cardBrand || null,
        date: entryData.date || new Date()
      });

      await entry.save();

      return {
        id: entry._id.toString(),
        description: entry.description,
        amount: entry.amount,
        type: entry.type,
        cardBrand: entry.cardBrand || undefined,
        date: entry.date,
        createdAt: entry.createdAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletar entrada
   */
  async deleteEntry(userId, entryId) {
    try {
      const result = await Entry.deleteOne({ _id: entryId, userId });

      if (result.deletedCount === 0) {
        throw new Error('Entrada não encontrada');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obter estatísticas
   */
  async getStats(userId) {
    try {
      const entries = await Entry.find({ userId });

      const totalIncome = entries
        .filter(e => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0);

      const totalExpenses = entries
        .filter(e => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);

      const balance = totalIncome - totalExpenses;

      return {
        balance,
        totalIncome,
        totalExpenses,
        totalEntries: entries.length
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Criar dados de demonstração (seed)
   */
  async seedData(userId) {
    try {
      // Limpar entradas existentes do usuário
      await Entry.deleteMany({ userId });

      const seedEntries = [
        {
          userId,
          description: 'Salário',
          amount: 5000,
          type: 'income',
          date: new Date('2024-01-05')
        },
        {
          userId,
          description: 'Freelance',
          amount: 1500,
          type: 'income',
          date: new Date('2024-01-15')
        },
        {
          userId,
          description: 'Aluguel',
          amount: 1200,
          type: 'expense',
          cardBrand: 'visa',
          date: new Date('2024-01-10')
        },
        {
          userId,
          description: 'Supermercado',
          amount: 450,
          type: 'expense',
          cardBrand: 'mastercard',
          date: new Date('2024-01-12')
        },
        {
          userId,
          description: 'Internet',
          amount: 99.90,
          type: 'expense',
          cardBrand: 'elo',
          date: new Date('2024-01-08')
        },
        {
          userId,
          description: 'Academia',
          amount: 120,
          type: 'expense',
          cardBrand: 'visa',
          date: new Date('2024-01-07')
        }
      ];

      await Entry.insertMany(seedEntries);

      return {
        message: 'Dados de demonstração criados com sucesso',
        count: seedEntries.length
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletar todas as entradas do usuário
   */
  async deleteAllEntries(userId) {
    try {
      const result = await Entry.deleteMany({ userId });

      return {
        message: 'Todas as entradas foram deletadas',
        count: result.deletedCount
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new EntriesService();
