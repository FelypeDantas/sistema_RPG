import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TransactionItemProps {
  date: string;
  description: string;
  category: string;
  value: string;
  type: "income" | "expense";
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Fixa: { bg: "bg-primary/10", text: "text-primary" },
  Extra: { bg: "bg-info/10", text: "text-info" },
  Lazer: { bg: "bg-warning/10", text: "text-warning" },
  Alimentação: { bg: "bg-destructive/10", text: "text-destructive" },
  Transporte: { bg: "bg-accent", text: "text-accent-foreground" },
  default: { bg: "bg-muted", text: "text-muted-foreground" },
};

export function TransactionItem({ 
  date, 
  description, 
  category, 
  value, 
  type 
}: TransactionItemProps) {
  const colors = categoryColors[category] || categoryColors.default;
  const isIncome = type === "income";

  return (
    <div className="flex items-center justify-between py-4 px-4 hover:bg-muted/30 rounded-xl transition-colors duration-200 group">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-110 ${
          isIncome ? 'bg-primary/10' : 'bg-destructive/10'
        }`}>
          {isIncome ? (
            <ArrowUpRight className="w-5 h-5 text-primary" />
          ) : (
            <ArrowDownRight className="w-5 h-5 text-destructive" />
          )}
        </div>
        <div>
          <p className="font-medium text-foreground">{description}</p>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className={`badge-category ${colors.bg} ${colors.text}`}>
          {category}
        </span>
        <span className={`font-semibold ${
          isIncome ? 'text-primary' : 'text-destructive'
        }`}>
          {isIncome ? '+' : '-'} {value}
        </span>
      </div>
    </div>
  );
}
