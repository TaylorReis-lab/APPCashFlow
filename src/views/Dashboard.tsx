import { useEffect, useState } from "react";
import { apiListEntries } from "@/lib/api";
import { ArrowUpCircle, ArrowDownCircle, Wallet, Plus, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/utils/cn";
import type { ExpenseEntry } from "@/types";

interface DashboardProps {
  refreshKey: number;
  onNavigate: (tab: "dashboard" | "add" | "history" | "settings") => void;
}

export function Dashboard({ refreshKey, onNavigate }: DashboardProps) {
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);
  const [stats, setStats] = useState({ income: 0, expenses: 0, balance: 0 });
  const [connected, setConnected] = useState(true);
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem("cashflow_user_name") || "Usuário";

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true);
      const res = await apiListEntries();
      if (res.ok) {
        setEntries(res.data);
        setStats({
          income: res.income,
          expenses: res.expenses,
          balance: res.balance,
        });
        setConnected(true);
      } else {
        setConnected(false);
      }
      setLoading(false);
    }
    fetchEntries();
  }, [refreshKey]);

  const moneyBRL = (n: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

  const recentEntries = entries.slice(0, 5);

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Olá, {userName}! 👋</h1>
          <p className="text-sm text-slate-500">Seu resumo financeiro</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold",
            connected
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          )}>
            {connected ? <Wifi size={10} /> : <WifiOff size={10} />}
            {connected ? "Online" : "Offline"}
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
            <Wallet size={20} />
          </div>
        </div>
      </header>

      {/* Main Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-200">
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-80">Saldo Total</p>
          <h2 className="mt-1 text-3xl font-bold">
            {loading ? "..." : moneyBRL(stats.balance)}
          </h2>

          <div className="mt-6 flex justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white/20 p-2">
                <ArrowUpCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase opacity-70">Entradas</p>
                <p className="text-sm font-semibold">{moneyBRL(stats.income)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white/20 p-2">
                <ArrowDownCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase opacity-70">Saídas</p>
                <p className="text-sm font-semibold">{moneyBRL(stats.expenses)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5" />
      </div>

      {!connected && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-xs font-bold text-amber-700">⚠️ API Desconectada</p>
          <p className="mt-1 text-[10px] text-amber-600">
            Verifique se a API está rodando em localhost:3000
          </p>
        </div>
      )}

      {/* Quick Action */}
      <button
        onClick={() => onNavigate("add")}
        className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 active:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
            <Plus size={20} />
          </div>
          <span className="font-semibold text-slate-700">Novo Registro</span>
        </div>
        <div className="text-xs text-slate-400 font-medium">Lançar agora →</div>
      </button>

      {/* Recent Activity */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Atividades Recentes</h3>
          <button
            onClick={() => onNavigate("history")}
            className="text-xs font-semibold text-indigo-600"
          >
            Ver tudo
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
              Carregando...
            </div>
          ) : recentEntries.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
              Nenhuma movimentação ainda.
            </div>
          ) : (
            recentEntries.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "rounded-xl p-2.5",
                      e.type === "gasto"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-emerald-50 text-emerald-600"
                    )}
                  >
                    {e.type === "gasto" ? (
                      <ArrowDownCircle size={20} />
                    ) : (
                      <ArrowUpCircle size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {e.description}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400">
                      {new Date(e.createdAt).toLocaleDateString("pt-BR")}
                      {e.cardBrand && ` • ${e.cardBrand}`}
                    </p>
                  </div>
                </div>
                <p
                  className={cn(
                    "text-sm font-bold",
                    e.type === "gasto" ? "text-rose-600" : "text-emerald-600"
                  )}
                >
                  {e.type === "gasto" ? "-" : "+"} {moneyBRL(e.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
