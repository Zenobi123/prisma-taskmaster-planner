
import { FactureStatus } from "@/types/facture";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: FactureStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "non_paye":
      return <Badge variant="destructive">Non payé</Badge>;
    case "partiellement_paye":
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Partiellement payé</Badge>;
    case "paye":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Payé</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
};
