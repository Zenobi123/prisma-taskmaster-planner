
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeVariant } from "@/utils/factureUtils";

interface StatusBadgeProps {
  status: string;
  type: "document" | "paiement";
}

export const StatusBadge = ({ status, type }: StatusBadgeProps) => {
  const variant = getStatusBadgeVariant(status, type);
  
  const getStatusLabel = (status: string, type: "document" | "paiement") => {
    if (type === "document") {
      switch (status) {
        case 'brouillon':
          return 'Brouillon';
        case 'envoyée':
          return 'Envoyée';
        case 'annulée':
          return 'Annulée';
        default:
          return status;
      }
    } else {
      switch (status) {
        case 'non_payée':
          return 'Non payée';
        case 'partiellement_payée':
          return 'Partiellement payée';
        case 'payée':
          return 'Payée';
        case 'en_retard':
          return 'En retard';
        default:
          return status;
      }
    }
  };

  return (
    <Badge variant={variant} className="text-xs">
      {getStatusLabel(status, type)}
    </Badge>
  );
};

export default StatusBadge;
