// ============================================================================
// CASHFLOW LOCAL API (Mock API Stand-alone)
// Substitui completamente o servidor Vercel/MongoDB. Tudo fica salvo no celular!
// ============================================================================

export type Entry = {
  id: string; // Exigido pelo Frontend como obrigatório
  description: string;
  amount: number;
  type: 'gasto' | 'entrada';
  cardBrand?: any;
  createdAt: string; // Exigido pelo Frontend como obrigatório
};

const STORAGE_KEY = 'cashflow_entries';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function getLocal(): Entry[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLocal(data: Entry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('cashflow_api_token', token);
  } else {
    localStorage.removeItem('cashflow_api_token');
  }
}

// ----------------------------------------------------------------------------
// AUTHENTICATION
// ----------------------------------------------------------------------------
export async function apiLogin(payload: any): Promise<{ok: boolean, data?: any, error?: any}> {
  await delay(600); 
  return { 
    ok: true, 
    data: {
      token: 'local-mock-token-777', 
      user: { name: payload.username || 'Usuário' } 
    }
  };
}

export async function apiRegister(payload: any): Promise<{ok: boolean, data?: any, error?: any}> {
  await delay(600);
  return { 
    ok: true, 
    data: {
      token: 'local-mock-token-777', 
      user: { name: payload.name || payload.username || 'Usuário' } 
    }
  };
}

// ----------------------------------------------------------------------------
// ENTRIES
// ----------------------------------------------------------------------------
export async function apiListEntries(filters?: any) {
  await delay(300);
  let entries = getLocal();
  entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  if (filters?.type && filters.type !== 'todos') {
    entries = entries.filter(e => e.type === filters.type);
  }

  const allEntries = getLocal();
  const income = allEntries.filter(e => e.type === 'entrada').reduce((acc, curr) => acc + curr.amount, 0);
  const expenses = allEntries.filter(e => e.type === 'gasto').reduce((acc, curr) => acc + curr.amount, 0);

  return { 
    ok: true, 
    data: entries,
    income,
    expenses,
    balance: income - expenses,
    error: undefined
  };
}

export async function apiCreateEntry(data: any): Promise<{ok: boolean, data?: any, error?: any}> {
  await delay(400);
  const entries = getLocal();
  const newEntry: Entry = {
    ...data,
    amount: Number(data.amount),
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };
  entries.push(newEntry);
  saveLocal(entries);
  return { ok: true, data: newEntry };
}

export async function apiDeleteEntry(id: string): Promise<{ok: boolean, error?: any}> {
  await delay(300);
  let entries = getLocal();
  entries = entries.filter(e => e.id !== id);
  saveLocal(entries);
  return { ok: true };
}

// ----------------------------------------------------------------------------
// SETTINGS
// ----------------------------------------------------------------------------
export async function apiSeedDemo(): Promise<{ok: boolean, error?: any}> {
  await delay(500);
  const entries = getLocal();
  const demoData: Entry[] = [
    { id: 'd1', description: 'Salário Mensal', amount: 5500, type: 'entrada', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'd2', description: 'Supermercado', amount: 850.90, type: 'gasto', cardBrand: 'mastercard', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'd3', description: 'Uber', amount: 45.50, type: 'gasto', cardBrand: 'visa', createdAt: new Date().toISOString() },
    { id: 'd4', description: 'Freelance Design', amount: 1200, type: 'entrada', createdAt: new Date().toISOString() }
  ];
  saveLocal([...entries, ...demoData]);
  return { ok: true };
}

export async function apiDeleteAll(): Promise<{ok: boolean, error?: any}> {
  await delay(300);
  localStorage.removeItem(STORAGE_KEY);
  return { ok: true };
}
