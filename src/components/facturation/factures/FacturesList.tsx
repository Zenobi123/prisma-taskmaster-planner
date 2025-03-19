
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Eye, 
  Edit, 
  Trash,
  CreditCard
} from "lucide-react";
import { Facture } from "@/types/facture";

interface FacturesListProps {
  factures: Facture[];
  searchTerm: string;
  handleView: (facture: Facture) => void;
  handleEdit: (facture: Facture) => void;
  handleDelete: (facture: Facture) => void;
  handleAddPayment: (facture: Facture) => void;
}

export const FacturesList = ({ 
  factures, 
  searchTerm, 
  handleView, 
  handleEdit, 
  handleDelete, 
  handleAddPayment 
}: FacturesListProps) => {
  
  const filteredFactures = factures.filter(facture => 
    facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
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

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return dateString;
    }
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N° Facture</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredFactures.length > 0 ? (
          filteredFactures.map((facture) => (
            <TableRow key={facture.id}>
              <TableCell className="font-medium">{facture.id.substring(0, 8)}</TableCell>
              <TableCell>{facture.client.nom}</TableCell>
              <TableCell>{formatDate(facture.date)}</TableCell>
              <TableCell>{formatMontant(facture.montant)}</TableCell>
              <TableCell>{getStatusBadge(facture.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleView(facture)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleAddPayment(facture)}
                  >
                    <CreditCard className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleEdit(facture)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDelete(facture)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
              {searchTerm ? "Aucune facture trouvée" : "Aucune facture créée"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
