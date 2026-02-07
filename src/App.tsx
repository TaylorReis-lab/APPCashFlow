import { useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  History as HistoryIcon,
  Settings,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Dashboard } from "@/views/Dashboard";
import { AddEntry } from "@/views/AddEntry";
import { History } from "@/views/History";
import { SettingsView } from "@/views/SettingsView";
import { Login } from "@/components/Login";
import { setAuthToken } from "@/lib/api";

type Tab = "dashboard" | "add" | "history" | "settings";

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("CashFlow_api_token");
  });
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleLogin = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem("CashFlow_user_name");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onSuccess={handleLogin} />;
  }

  // Load entries globally or per view? Let's do it in the views but pass refreshKey

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard refreshKey={refreshKey} onNavigate={setActiveTab} />;
      case "add":
        return (
          <AddEntry
            onBack={() => setActiveTab("dashboard")}
            onSuccess={() => {
              triggerRefresh();
              setActiveTab("history");
            }}
          />
        );
      case "history":
        return <History refreshKey={refreshKey} onRefresh={triggerRefresh} />;
      case "settings":
        return (
          <SettingsView onReset={triggerRefresh} onLogout={handleLogout} />
        );
      default:
        return <Dashboard refreshKey={refreshKey} onNavigate={setActiveTab} />;
    }
  };

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Início" },
    { id: "add", icon: PlusCircle, label: "Adicionar" },
    { id: "history", icon: HistoryIcon, label: "Extrato" },
    { id: "settings", icon: Settings, label: "Ajustes" },
  ] as const;

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900 font-sans select-none overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">{renderView()}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/80 pb-safe backdrop-blur-lg">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 transition-colors",
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
