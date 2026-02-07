import type { CardBrand, EntryType, ExpenseEntry } from "@/types";

// ════════════════════════════════════════════════════════════
//  FINEXA API CLIENT v2.0
//  Conecta ao backend FINEXA rodando separadamente
//
//  Configure a URL da API:
//    - Local:     http://localhost:3000/api
//    - Produção:  defina VITE_API_URL no .env
// ════════════════════════════════════════════════════════════

const API_BASE =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:3000/api";

let authToken: string | null = localStorage.getItem("finexa_api_token");

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("finexa_api_token", token);
  } else {
    localStorage.removeItem("finexa_api_token");
    localStorage.removeItem("finexa_user_name");
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

// ── Fetch Helper ────────────────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; error: { message: string } }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { ...headers, ...(options?.headers as Record<string, string>) },
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        setAuthToken(null);
        window.location.reload();
      }
      return {
        ok: false,
        error: body.error || { message: `Erro ${res.status}` },
      };
    }

    // A API v2 retorna { ok, data, ... } para entries
    // e { ok, token, user } para login
    // Normalizamos para sempre retornar .data
    if (body.data !== undefined) {
      return { ok: true, data: body.data };
    }
    return { ok: true, data: body };
  } catch {
    return {
      ok: false,
      error: {
        message: "Falha de conexão. Verifique se a API está rodando.",
      },
    };
  }
}

// ── Auth ─────────────────────────────────────────────────────
export type LoginInput = { username: string; password: string };
export type RegisterInput = {
  username: string;
  password: string;
  name?: string;
};

export type AuthResult = {
  token: string;
  user: { id: string; username: string; name: string };
};

export async function apiLogin(input: LoginInput) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false as const,
      error: body.error || { message: "Erro no login" },
    };
  }
  return {
    ok: true as const,
    data: { token: body.token, user: body.user } as AuthResult,
  };
}

export async function apiRegister(input: RegisterInput) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false as const,
      error: body.error || { message: "Erro no registro" },
    };
  }
  return {
    ok: true as const,
    data: { token: body.token, user: body.user } as AuthResult,
  };
}

// ── Entries ──────────────────────────────────────────────────
export type CreateEntryInput = {
  type: EntryType;
  amount: number | string;
  description?: string;
  cardBrand?: CardBrand;
};

export type ListParams = {
  type?: EntryType | "all";
  cardBrand?: CardBrand | "all";
  q?: string;
};

export type ListResult = {
  total: number;
  income: number;
  expenses: number;
  balance: number;
  data: ExpenseEntry[];
};

export async function apiListEntries(params: ListParams = {}) {
  const query = new URLSearchParams();
  if (params.type && params.type !== "all") query.set("type", params.type);
  if (params.q) query.set("q", params.q);
  if (params.cardBrand && params.cardBrand !== "all")
    query.set("cardBrand", params.cardBrand);

  // A API v2 retorna { ok, total, income, expenses, balance, data }
  const res = await fetch(`${API_BASE}/entries?${query.toString()}`, {
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      setAuthToken(null);
      window.location.reload();
    }
    return { ok: false as const, error: body.error || { message: "Erro" } };
  }

  return {
    ok: true as const,
    data: body.data as ExpenseEntry[],
    total: body.total as number,
    income: body.income as number,
    expenses: body.expenses as number,
    balance: body.balance as number,
  };
}

export async function apiCreateEntry(input: CreateEntryInput) {
  // Validação local rápida
  const amount =
    typeof input.amount === "string"
      ? Number(input.amount.replace(",", "."))
      : input.amount;

  if (!amount || amount <= 0) {
    return {
      ok: false as const,
      error: { message: "Valor deve ser maior que zero." },
    };
  }
  if (!input.description?.trim()) {
    return {
      ok: false as const,
      error: { message: "Descrição é obrigatória." },
    };
  }

  return apiFetch<ExpenseEntry>("/entries", {
    method: "POST",
    body: JSON.stringify({
      type: input.type,
      amount,
      description: input.description?.trim(),
      ...(input.cardBrand ? { cardBrand: input.cardBrand } : {}),
    }),
  });
}

export async function apiDeleteEntry(id: string) {
  return apiFetch<{ id: string }>(`/entries/${id}`, { method: "DELETE" });
}

export async function apiDeleteAll() {
  return apiFetch<{ removed: number }>("/entries", { method: "DELETE" });
}

export async function apiSeedDemo() {
  return apiFetch<{ seeded: number }>("/entries/seed", { method: "POST" });
}
