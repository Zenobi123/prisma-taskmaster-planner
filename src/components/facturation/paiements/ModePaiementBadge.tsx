
import { Building, Banknote, CreditCard, Wallet, SmartphoneNfc } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ModePaiementBadgeProps {
  mode: string;
}

const ModePaiementBadge = ({ mode }: ModePaiementBadgeProps) => {
  const getModePaiementConfig = (mode: string): { icon: React.ReactNode; color: string; label: string } => {
    switch (mode.toLowerCase()) {
      case "virement":
        return { 
          icon: <Building className="h-4 w-4 mr-1.5" />, 
          color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
          label: "Virement"
        };
      case "espèces":
        return { 
          icon: <Banknote className="h-4 w-4 mr-1.5" />, 
          color: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
          label: "Espèces"
        };
      case "chèque":
        return { 
          icon: <CreditCard className="h-4 w-4 mr-1.5" />, 
          color: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
          label: "Chèque"
        };
      case "orange_money":
        return { 
          icon: <SmartphoneNfc className="h-4 w-4 mr-1.5" />, 
          color: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
          label: "Orange Money"
        };
      case "mtn_money":
        return { 
          icon: <SmartphoneNfc className="h-4 w-4 mr-1.5" />, 
          color: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
          label: "MTN Money"
        };
      default:
        return { 
          icon: <Wallet className="h-4 w-4 mr-1.5" />, 
          color: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200",
          label: mode.charAt(0).toUpperCase() + mode.slice(1)
        };
    }
  };

  const { icon, color, label } = getModePaiementConfig(mode);

  return (
    <Badge variant="outline" className={`flex items-center px-2 py-1 ${color} font-medium`}>
      {icon}
      <span>{label}</span>
    </Badge>
  );
};

export default ModePaiementBadge;
