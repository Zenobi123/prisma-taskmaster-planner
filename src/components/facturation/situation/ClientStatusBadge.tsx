
import { Badge } from "@/components/ui/badge";
import { Facture } from "@/types/facture";

interface ClientStatusBadgeProps {
  status: Facture["status"];
}

export const ClientStatusBadge = ({ status }: ClientStatusBadgeProps) => {
  switch (status) {
    case "payée":
      return <Badge className="bg-green-500">Payée</Badge>;
    case "partiellement_payée":
      return <Badge className="bg-amber-500">Partiellement payée</Badge>;
    case "en_attente":
      return <Badge variant="outline">En attente</Badge>;
    case "envoyée":
      return <Badge className="bg-blue-500">Envoyée</Badge>;
    case "annulée":
      return <Badge variant="destructive">Annulée</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
