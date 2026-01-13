import { LucideIcon } from "lucide-react";

interface Attribute {
  name: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
}

interface AttributeBarProps {
  attribute: Attribute;
}

export const AttributeBar = ({ attribute }: AttributeBarProps) => {
  const Icon = attribute.icon;
  
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${attribute.bgColor}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white font-medium text-sm">{attribute.name}</span>
            <span className="text-gray-500 text-xs ml-2 hidden group-hover:inline transition-all">
              {attribute.description}
            </span>
          </div>
        </div>
        <span className="text-white font-bold font-mono text-lg">{attribute.value}</span>
      </div>
      
      <div className="relative h-2.5 bg-cyber-darker rounded-full overflow-hidden border border-white/5">
        <div 
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${attribute.color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${attribute.value}%` }}
        />
        {/* Shimmer effect */}
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 animate-shimmer"
          style={{ width: `${attribute.value}%` }}
        />
      </div>
    </div>
  );
};
