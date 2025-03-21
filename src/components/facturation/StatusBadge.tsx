
import { Badge } from "@/components/ui/badge";
import { Facture } from "@/types/facture";

interface StatusBadgeProps {
  status: Facture["status"]; // Use the Facture type to ensure status is correctly typed
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "payée":
      return <Badge className="bg-green-500 hover:bg-green-600">Payée</Badge>;
    case "en_attente":
      return <Badge variant="outline" className="text-neutral-600 border-neutral-400">En attente</Badge>;
    case "partiellement_payée":
      return <Badge className="bg-amber-500 hover:bg-amber-600">Partiellement payée</Badge>;
    case "envoyée":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Envoyée</Badge>;
    case "annulée":
      return <Badge className="bg-red-500 hover:bg-red-600">Annulée</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default StatusBadge;
