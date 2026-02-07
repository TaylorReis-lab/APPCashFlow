import { useState } from "react";
import {
  Lock,
  User,
  ShieldCheck,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  Globe,
} from "lucide-react";
import { apiLogin, apiRegister } from "@/lib/api";

interface LoginProps {
  onSuccess: (token: string) => void;
}

export function Login({ onSuccess }: LoginProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "login") {
      const res = await apiLogin({ username, password });
      if (res.ok) {
        localStorage.setItem("finexa_user_name", res.data.user.name);
        onSuccess(res.data.token);
      } else {
        setError(res.error.message || "Credenciais inválidas.");
        setLoading(false);
      }
    } else {
      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        setLoading(false);
        return;
      }
      const res = await apiRegister({
        username,
        password,
        name: name || username,
      });
      if (res.ok) {
        localStorage.setItem("finexa_user_name", res.data.user.name);
        onSuccess(res.data.token);
      } else {
        setError(res.error.message || "Erro ao criar conta.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 text-slate-900 font-sans">
      <div className="w-full max-w-sm">
        {/* Logo / Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-5 text-white shadow-xl shadow-indigo-200">
            <ShieldCheck size={36} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">FINEXA</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Controle Financeiro Profissional
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <Globe size={12} />
            <span>Conexão segura HTTPS • API Real</span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white p-7 shadow-xl shadow-slate-100 border border-slate-100">
          {/* Tabs */}
          <div className="mb-6 flex gap-1 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all ${
                mode === "login"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <LogIn size={14} /> Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all ${
                mode === "register"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-400"
              }`}
            >
              <UserPlus size={14} /> Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Nome
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="h-12 w-full rounded-xl border-none bg-slate-50 pl-10 pr-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Usuário
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: admin"
                  className="h-12 w-full rounded-xl border-none bg-slate-50 pl-10 pr-4 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === "register" ? "Mínimo 6 caracteres" : "Sua senha"
                  }
                  className="h-12 w-full rounded-xl border-none bg-slate-50 pl-10 pr-12 text-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                  required
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 text-center border border-rose-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-white text-sm shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading
                ? "Verificando..."
                : mode === "login"
                  ? "Entrar"
                  : "Criar Conta"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[10px] text-slate-400">
          🔒 Seus dados são protegidos com criptografia de ponta a ponta.
        </div>
      </div>
    </div>
  );
}
