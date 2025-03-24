import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  type?: "document" | "paiement";
}

const StatusBadge = ({ status, type = "document" }: StatusBadgeProps) => {
  if (type === "document") {
    switch (status) {
      case "brouillon":
        return <Badge variant="outline" className="text-neutral-600 border-neutral-400">Brouillon</Badge>;
      case "envoyée":
        return <Badge className="bg-blue-500 hover:bg-blue-600 rounded-full px-3">Envoyée</Badge>;
      case "annulée":
        return <Badge className="bg-red-500 hover:bg-red-600">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  } else {
    switch (status) {
      case "payée":
        return <Badge className="bg-green-500 hover:bg-green-600">Payée</Badge>;
      case "non_payée":
        return <Badge variant="outline" className="text-neutral-600 border-neutral-400">Non payée</Badge>;
      case "partiellement_payée":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Partiellement payée</Badge>;
      case "en_retard":
        return <Badge className="bg-red-500 hover:bg-red-600">En retard</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }
};

export default StatusBadge;
