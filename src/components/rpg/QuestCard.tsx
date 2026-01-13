import { Check, Flame, Zap } from "lucide-react";

interface Quest {
  title: string;
  xp: number;
  attribute: string;
  completed: boolean;
  streak: number;
}

interface QuestCardProps {
  quest: Quest;
}

const attributeColors: Record<string, string> = {
  "Físico": "text-neon-red border-neon-red/30 bg-neon-red/10",
  "Mente": "text-neon-blue border-neon-blue/30 bg-neon-blue/10",
  "Social": "text-neon-purple border-neon-purple/30 bg-neon-purple/10",
  "Finanças": "text-neon-green border-neon-green/30 bg-neon-green/10"
};

export const QuestCard = ({ quest }: QuestCardProps) => {
  return (
    <div 
      className={`
        relative p-4 rounded-xl border transition-all duration-300 cursor-pointer
        ${quest.completed 
          ? 'bg-neon-green/10 border-neon-green/30' 
          : 'bg-cyber-darker border-white/10 hover:border-neon-cyan/50 hover:bg-cyber-card'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div 
            className={`
              w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
              ${quest.completed 
                ? 'bg-neon-green border-neon-green' 
                : 'border-gray-600 hover:border-neon-cyan'
              }
            `}
          >
            {quest.completed && <Check className="w-4 h-4 text-cyber-dark" />}
          </div>
          
          <div>
            <h4 className={`font-medium ${quest.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
              {quest.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${attributeColors[quest.attribute]}`}>
                {quest.attribute}
              </span>
              {quest.streak > 0 && (
                <span className="flex items-center gap-1 text-xs text-neon-orange">
                  <Flame className="w-3 h-3" />
                  {quest.streak}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* XP Reward */}
        <div className={`
          flex items-center gap-1 px-2 py-1 rounded-lg
          ${quest.completed ? 'bg-neon-green/20' : 'bg-neon-cyan/10'}
        `}>
          <Zap className={`w-4 h-4 ${quest.completed ? 'text-neon-green' : 'text-neon-cyan'}`} />
          <span className={`font-bold text-sm ${quest.completed ? 'text-neon-green' : 'text-neon-cyan'}`}>
            +{quest.xp}
          </span>
        </div>
      </div>
      
      {/* Completed glow effect */}
      {quest.completed && (
        <div className="absolute inset-0 rounded-xl bg-neon-green/5 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};
