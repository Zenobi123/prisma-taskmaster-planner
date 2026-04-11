
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  isLoading?: boolean;
  badge?: {
    text: string;
    variant: "outline" | "default" | "destructive" | "secondary";
    className?: string;
  };
  onClick?: () => void;
  className?: string;
  isOverdue?: boolean;
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  isLoading, 
  badge, 
  onClick, 
  className = "",
  isOverdue = false
}: StatsCardProps) => {
  const cardClasses = `card ${onClick ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''} ${
    isOverdue ? 'border-l-4 border-red-500 bg-red-50' : ''
  } ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      <h3 className="font-semibold text-neutral-800 mb-2 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
        {isOverdue && <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-pulse shrink-0" />}
        {title}
      </h3>
      <div className="flex items-center flex-wrap gap-1">
        <div className={`text-2xl sm:text-3xl font-bold mr-1 sm:mr-2 ${isOverdue ? 'text-red-600' : 'text-primary'}`}>
          {isLoading ? (
            <span className="animate-pulse">--</span>
          ) : (
            value
          )}
        </div>
        {badge && !isLoading && (
          <Badge variant={badge.variant} className={badge.className}>
            {badge.text}
          </Badge>
        )}
      </div>
      {description && (
        <p className="text-neutral-600 text-sm mt-1">
          {isLoading ? (
            <span className="animate-pulse">-- {description}</span>
          ) : (
            description
          )}
        </p>
      )}
      {isOverdue && !isLoading && (
        <p className="text-red-600 text-xs mt-2 font-medium flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Attention requise
        </p>
      )}
    </div>
  );
};
