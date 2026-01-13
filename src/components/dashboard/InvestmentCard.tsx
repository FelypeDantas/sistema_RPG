import { TrendingUp, Building2 } from "lucide-react";

interface InvestmentCardProps {
  date: string;
  type: string;
  institution: string;
  investedValue: string;
  currentValue: string;
  profitability: number;
}

export function InvestmentCard({
  date,
  type,
  institution,
  investedValue,
  currentValue,
  profitability,
}: InvestmentCardProps) {
  const isPositive = profitability >= 0;

  return (
    <div className="card-financial group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-info/10 rounded-xl group-hover:bg-info/20 transition-colors">
            <Building2 className="w-5 h-5 text-info" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{type}</p>
            <p className="text-sm text-muted-foreground">{institution}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          isPositive 
            ? 'bg-primary/10 text-primary' 
            : 'bg-destructive/10 text-destructive'
        }`}>
          <TrendingUp className={`w-3 h-3 ${!isPositive && 'rotate-180'}`} />
          <span>{profitability}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Investido</p>
          <p className="font-semibold text-foreground">{investedValue}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">Valor Atual</p>
          <p className="font-semibold text-primary">{currentValue}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3">Data: {date}</p>
    </div>
  );
}
