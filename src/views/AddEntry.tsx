import { useState } from "react";
import { ChevronLeft, Save } from "lucide-react";
import { apiCreateEntry } from "@/lib/api";
import { CardBrand, EntryType } from "@/types";
import { Input, Label, Select } from "@/components/Field";

interface AddEntryProps {
  onBack: () => void;
  onSuccess: () => void;
}

const BRANDS: CardBrand[] = [
  "Visa",
  "Mastercard",
  "Elo",
  "American Express",
  "Hipercard",
  "Discover",
  "Diners",
  "Outra",
];

export function AddEntry({ onBack, onSuccess }: AddEntryProps) {
  const [type, setType] = useState<EntryType>("gasto");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [cardBrand, setCardBrand] = useState<CardBrand | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await apiCreateEntry({
      type,
      amount,
      description,
      ...(cardBrand ? { cardBrand } : {}),
    });

    if (res.ok) {
      onSuccess();
    } else {
      setError(res.error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="flex items-center gap-4 px-4 py-6">
        <button 
          onClick={onBack}
          className="rounded-xl bg-slate-100 p-2 text-slate-600"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Novo Lançamento</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 space-y-6 px-4 pb-10">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("gasto")}
            className={`flex-1 rounded-2xl py-3 text-sm font-bold transition-all ${
              type === "gasto"
                ? "bg-rose-500 text-white shadow-lg shadow-rose-100"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => setType("entrada")}
            className={`flex-1 rounded-2xl py-3 text-sm font-bold transition-all ${
              type === "entrada"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            Entrada
          </button>
        </div>

        <div className="space-y-1">
          <Label>Valor</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="h-16 w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-12 pr-4 text-2xl font-bold text-slate-900 outline-none focus:border-indigo-400"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label>O que foi?</Label>
          <Input 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Ex: Almoço, Uber, Salário..."
            className="h-14 rounded-2xl bg-slate-50 border-slate-100"
            required
          />
        </div>

        {type === "gasto" && (
          <div className="space-y-1">
            <Label>Cartão (opcional)</Label>
            <Select 
              value={cardBrand} 
              onChange={(e) => setCardBrand(e.target.value as CardBrand)}
              className="h-14 rounded-2xl bg-slate-50 border-slate-100"
            >
              <option value="">Nenhum</option>
              {BRANDS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </Select>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-xl shadow-indigo-100 active:scale-95 transition-all disabled:opacity-50"
        >
          <Save size={20} />
          <span>Salvar Lançamento</span>
        </button>
      </form>
    </div>
  );
}
