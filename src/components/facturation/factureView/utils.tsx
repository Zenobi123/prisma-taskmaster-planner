
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

// Formater le montant
export const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
};

// Formater la date
export const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: fr });
  } catch (error) {
    return dateString;
  }
};

// Obtenir le badge de statut
export const getStatusBadge = (status: string) => {
  switch (status) {
    case "payée":
      return <Badge className="bg-green-500">Payée</Badge>;
    case "en_attente":
      return <Badge variant="outline">En attente</Badge>;
    case "partiellement_payée":
      return <Badge className="bg-amber-500">Partiellement payée</Badge>;
    case "envoyée":
      return <Badge className="bg-blue-500">Envoyée</Badge>;
    case "annulée":
      return <Badge variant="destructive">Annulée</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
