
import { Building, Banknote, CreditCard, Wallet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModePaiementBadgeProps {
  mode: string;
  className?: string;
}

const ModePaiementBadge = ({ mode, className }: ModePaiementBadgeProps) => {
  const getModePaiementConfig = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "virement":
        return { 
          icon: <Building className="h-4 w-4 mr-1" />, 
          bgColor: "bg-blue-100 text-blue-800"
        };
      case "espèces":
        return { 
          icon: <Banknote className="h-4 w-4 mr-1" />, 
          bgColor: "bg-green-100 text-green-800"
        };
      case "chèque":
        return { 
          icon: <CreditCard className="h-4 w-4 mr-1" />, 
          bgColor: "bg-purple-100 text-purple-800"
        };
      case "orange_money":
      case "mtn_money":
        return { 
          icon: <Smartphone className="h-4 w-4 mr-1" />, 
          bgColor: "bg-orange-100 text-orange-800"
        };
      default:
        return { 
          icon: <Wallet className="h-4 w-4 mr-1" />, 
          bgColor: "bg-gray-100 text-gray-800"
        };
    }
  };

  const { icon, bgColor } = getModePaiementConfig(mode);

  return (
    <div className={cn("flex items-center px-2 py-1 rounded-full text-xs font-medium", bgColor, className)}>
      {icon}
      <span className="capitalize">{mode.replace('_', ' ')}</span>
    </div>
  );
};

export default ModePaiementBadge;
