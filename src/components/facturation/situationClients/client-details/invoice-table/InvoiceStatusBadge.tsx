
import { Badge } from "@/components/ui/badge";

interface InvoiceStatusBadgeProps {
  status: string;
}

const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "payée":
        return "success";
      case "partiellement_payée":
        return "secondary";
      case "en_retard":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {status.replace('_', ' ')}
    </Badge>
  );
};

export default InvoiceStatusBadge;
