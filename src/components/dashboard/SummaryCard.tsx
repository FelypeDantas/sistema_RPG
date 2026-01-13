import { CheckCircle2, AlertCircle } from "lucide-react";

interface SummaryCardProps {
  totalIncome: string;
  totalExpenses: string;
  balance: string;
  status: "healthy" | "warning" | "danger";
}

export function SummaryCard({ 
  totalIncome, 
  totalExpenses, 
  balance, 
  status 
}: SummaryCardProps) {
  const statusConfig = {
    healthy: {
      icon: CheckCircle2,
      text: "Controle saudável",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    warning: {
      icon: AlertCircle,
      text: "Atenção com gastos",
      color: "text-warning",
      bg: "bg-warning/10",
    },
    danger: {
      icon: AlertCircle,
      text: "Gastos elevados",
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="card-financial">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold text-foreground">Resumo Mensal</h3>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg}`}>
          <StatusIcon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-xs font-medium ${config.color}`}>{config.text}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Total Receitas</span>
          </div>
          <span className="font-semibold text-primary">{totalIncome}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">Total Despesas</span>
          </div>
          <span className="font-semibold text-destructive">{totalExpenses}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-info/5 rounded-xl border-2 border-info/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-info" />
            <span className="text-sm font-medium text-foreground">Saldo</span>
          </div>
          <span className="font-bold text-lg text-info">{balance}</span>
        </div>
      </div>
    </div>
  );
}
