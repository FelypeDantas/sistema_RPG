import { Wallet, Bell, Settings } from "lucide-react";

export function Header() {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="p-3 gradient-primary rounded-2xl shadow-lg">
          <Wallet className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Painel Financeiro
          </h1>
          <p className="text-sm text-muted-foreground capitalize">{currentDate}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2.5 rounded-xl bg-card hover:bg-muted transition-colors duration-200 shadow-sm">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2.5 rounded-xl bg-card hover:bg-muted transition-colors duration-200 shadow-sm">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
