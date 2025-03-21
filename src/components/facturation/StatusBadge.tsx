
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
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
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default StatusBadge;
