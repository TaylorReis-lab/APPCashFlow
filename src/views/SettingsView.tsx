import { Trash2, Database, Info, LogOut, Server } from "lucide-react";
import { apiSeedDemo, apiDeleteAll } from "@/lib/api";

interface SettingsViewProps {
  onReset: () => void;
  onLogout: () => void;
}

export function SettingsView({ onReset, onLogout }: SettingsViewProps) {
  const handleClear = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir TODOS os registros? Esta ação não pode ser desfeita.",
      )
    )
      return;
    const res = await apiDeleteAll();
    if (res.ok) {
      onReset();
      alert("Todos os registros foram excluídos!");
    } else {
      alert("Erro ao excluir registros.");
    }
  };

  const handleSeed = async () => {
    const res = await apiSeedDemo();
    if (res.ok) {
      onReset();
      alert("Dados de demonstração inseridos!");
    } else {
      alert(
        "Erro ao inserir dados de demonstração. Verifique se a API está rodando.",
      );
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Ajustes</h1>
        <p className="text-sm text-slate-500">
          Configurações e dados do aplicativo.
        </p>
      </header>

      <div className="space-y-4">
        {/* API Info */}
        <section className="rounded-2xl bg-white p-4 shadow-sm border border-slate-50">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Conexão API
          </h2>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
              <Server size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700">
                CashFlow API (MVC)
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                http://localhost:3000/api
              </p>
            </div>
            <div className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              JWT
            </div>
          </div>
        </section>

        {/* Data */}
        <section className="rounded-2xl bg-white p-4 shadow-sm border border-slate-50">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Dados
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleSeed}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Database size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Carregar Demo</p>
                <p className="text-[10px] text-slate-400">
                  Inserir registros de teste na API.
                </p>
              </div>
            </button>

            <button
              onClick={handleClear}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-rose-50 transition-colors"
            >
              <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
                <Trash2 size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-rose-600">Limpar Tudo</p>
                <p className="text-[10px] text-slate-400">
                  Excluir permanentemente todos os seus registros da API.
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* About */}
        <section className="rounded-2xl bg-white p-4 shadow-sm border border-slate-50">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Sobre & Acesso
          </h2>
          <div className="space-y-3">
            <div className="flex w-full items-center gap-3 rounded-xl p-2 text-left">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Info size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Versão 2.0.0</p>
                <p className="text-[10px] text-slate-400">
                  App + API Real separados com Docker.
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <LogOut size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Sair do App</p>
                <p className="text-[10px] text-slate-400">
                  Encerrar sessão e voltar ao login.
                </p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
