
import { Badge } from "@/components/ui/badge";

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
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  isLoading, 
  badge, 
  onClick, 
  className = "" 
}: StatsCardProps) => {
  const cardClasses = `card ${onClick ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''} ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      <h3 className="font-semibold text-neutral-800 mb-4">
        {title}
      </h3>
      <div className="flex items-center">
        <div className="text-3xl font-bold text-primary mr-2">
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
    </div>
  );
};
