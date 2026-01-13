import { Target } from "lucide-react";

interface ProgressCardProps {
  title: string;
  targetValue: string;
  currentValue: string;
  progress: number;
  deadline?: string;
}

export function ProgressCard({ 
  title, 
  targetValue, 
  currentValue, 
  progress,
  deadline 
}: ProgressCardProps) {
  const progressColor = progress >= 80 
    ? 'bg-primary' 
    : progress >= 50 
      ? 'bg-warning' 
      : 'bg-info';

  return (
    <div className="card-financial">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-accent rounded-lg">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">Meta Financeira</span>
          </div>
          {deadline && (
            <p className="text-xs text-muted-foreground ml-10">Prazo: {deadline}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{progress}%</p>
          <p className="text-xs text-muted-foreground">concluído</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="progress-bar">
          <div 
            className={`progress-bar-fill ${progressColor}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Atual</p>
            <p className="font-semibold text-foreground">{currentValue}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Meta</p>
            <p className="font-semibold text-foreground">{targetValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
