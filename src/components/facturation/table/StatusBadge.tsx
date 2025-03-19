
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "payée":
      return <Badge className="bg-green-500 hover:bg-green-600 transition-all duration-300">Payée</Badge>;
    case "partiellement_payée":
      return <Badge className="bg-blue-500 hover:bg-blue-600 transition-all duration-300">Partiellement payée</Badge>;
    case "en_attente":
      return <Badge variant="secondary" className="transition-all duration-300">En attente</Badge>;
    case "envoyée":
      return <Badge variant="outline" className="transition-all duration-300">Envoyée</Badge>;
    default:
      return null;
  }
};
