import { useEffect, useState } from "react";
import { apiListEntries, apiDeleteEntry } from "@/lib/api";
import { Search, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { EntryType, ExpenseEntry } from "@/types";

interface HistoryProps {
  refreshKey: number;
  onRefresh: () => void;
}

export function History({ refreshKey, onRefresh }: HistoryProps) {
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<EntryType | "all">("all");
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);

  useEffect(() => {
    async function fetchEntries() {
      const res = await apiListEntries({ q, type: typeFilter });
      if (res.ok) {
        setEntries(res.data);
      }
    }
    fetchEntries();
  }, [refreshKey, q, typeFilter]);

  const moneyBRL = (n: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir este registro?")) {
      const res = await apiDeleteEntry(id);
      if (res.ok) {
        onRefresh();
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Extrato</h1>
        <p className="text-sm text-slate-500">Histórico de suas movimentações.</p>
      </header>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por descrição..."
            className="h-12 w-full rounded-2xl border-none bg-white pl-10 pr-4 text-sm shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "gasto", "entrada"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
                typeFilter === t
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 ring-1 ring-slate-100"
              )}
            >
              {t === "all" ? "Todos" : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-medium text-slate-400">Nenhum registro encontrado.</p>
          </div>
        ) : (
          entries.map((e) => (
            <div key={e.id} className="group relative flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-50">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "rounded-xl p-2",
                  e.type === "gasto" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {e.type === "gasto" ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{e.description}</p>
                  <p className="text-[10px] font-medium text-slate-400">
                    {new Date(e.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                    {e.cardBrand && ` • ${e.cardBrand}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={cn(
                  "text-sm font-bold",
                  e.type === "gasto" ? "text-rose-600" : "text-emerald-600"
                )}>
                  {e.type === "gasto" ? "-" : "+"} {moneyBRL(e.amount)}
                </p>
                <button 
                  onClick={() => handleDelete(e.id)}
                  className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
