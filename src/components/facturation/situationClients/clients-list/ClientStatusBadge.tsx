
import { Badge } from "@/components/ui/badge";

interface ClientStatusBadgeProps {
  status: string;
}

const ClientStatusBadge = ({ status }: ClientStatusBadgeProps) => {
  switch (status) {
    case "àjour":
      return <Badge className="bg-green-500">À jour</Badge>;
    case "partiel":
      return <Badge className="bg-amber-500">Partiellement payé</Badge>;
    case "retard":
      return <Badge variant="destructive">En retard</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default ClientStatusBadge;
