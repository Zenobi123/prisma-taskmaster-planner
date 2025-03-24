
import { Building, Banknote, CreditCard, Wallet } from "lucide-react";

interface ModePaiementBadgeProps {
  mode: string;
}

const ModePaiementBadge = ({ mode }: ModePaiementBadgeProps) => {
  const getModePaiementIcon = (mode: string) => {
    switch (mode) {
      case "virement":
        return <Building className="h-4 w-4 mr-1" />;
      case "espèces":
        return <Banknote className="h-4 w-4 mr-1" />;
      case "chèque":
        return <CreditCard className="h-4 w-4 mr-1" />;
      default:
        return <Wallet className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="flex items-center">
      {getModePaiementIcon(mode)}
      <span className="capitalize">{mode}</span>
    </div>
  );
};

export default ModePaiementBadge;
