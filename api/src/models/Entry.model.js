const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'],
    lowercase: true
  },
  cardBrand: {
    type: String,
    enum: ['visa', 'mastercard', 'elo', 'amex', 'other', null],
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para melhor performance
entrySchema.index({ userId: 1, date: -1 });
entrySchema.index({ userId: 1, type: 1 });

// Remover __v do JSON de resposta
entrySchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  obj.id = obj._id;
  delete obj._id;
  return obj;
};

module.exports = mongoose.model('Entry', entrySchema);
