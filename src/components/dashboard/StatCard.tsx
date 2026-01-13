import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  gradient: "income" | "expense" | "investment" | "balance";
  subtitle?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  delay?: number;
}

const gradientClasses = {
  income: "gradient-income",
  expense: "gradient-expense",
  investment: "gradient-investment",
  balance: "gradient-balance",
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  subtitle,
  trend,
  delay = 0 
}: StatCardProps) {
  return (
    <div 
      className={`card-stat ${gradientClasses[gradient]} relative overflow-hidden`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 shimmer pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-5 h-5 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trend.positive ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
            }`}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        
        {subtitle && (
          <p className="text-white/70 text-xs mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
