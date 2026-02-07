// ============================================================
//  FINEXA API — Validador de Lançamentos
// ============================================================

const BRANDS = [
  'Visa',
  'Mastercard',
  'Elo',
  'American Express',
  'Hipercard',
  'Discover',
  'Diners',
  'Outra'
];

exports.validateEntry = (data) => {
  const errors = [];

  if (!data.type || !['gasto', 'entrada'].includes(data.type)) {
    errors.push("'type' deve ser 'gasto' ou 'entrada'.");
  }

  if (
    data.amount === undefined ||
    data.amount === null ||
    isNaN(Number(data.amount)) ||
    Number(data.amount) <= 0
  ) {
    errors.push("'amount' deve ser um número > 0.");
  }

  if (!data.description || !data.description.trim()) {
    errors.push("'description' é obrigatório.");
  }

  if (data.cardBrand && !BRANDS.includes(data.cardBrand)) {
    errors.push(`'cardBrand' inválido. Use: ${BRANDS.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
