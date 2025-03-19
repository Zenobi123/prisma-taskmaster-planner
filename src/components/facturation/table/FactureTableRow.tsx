
import { Facture } from "@/types/facture";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { FactureActions } from "./FactureActions";
import { format, parseISO } from "date-fns";
import { fr } from 'date-fns/locale';

interface FactureTableRowProps {
  facture: Facture;
  onDeleteInvoice: (id: string) => void;
  onPaiementClick: (facture: Facture) => void;
}

// Helper function for formatting amounts
const formatMontant = (montant: number) => {
  return montant.toLocaleString('fr-FR') + " FCFA";
};

// Helper function for formatting dates
const formatDate = (dateStr: string) => {
  try {
    // Vérifier si la date est déjà au format ISO
    if (dateStr.includes('T')) {
      return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: fr });
    }
    
    // Sinon, essayer de la parser au format YYYY-MM-DD
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: fr });
  } catch (e) {
    // En cas d'erreur, retourner la date telle quelle
    return dateStr;
  }
};

export const FactureTableRow = ({ facture, onDeleteInvoice, onPaiementClick }: FactureTableRowProps) => {
  return (
    <TableRow key={facture.id}>
      <TableCell className="font-medium">{facture.id}</TableCell>
      <TableCell>{facture.client_nom}</TableCell>
      <TableCell>{formatDate(facture.date)}</TableCell>
      <TableCell>{formatDate(facture.echeance)}</TableCell>
      <TableCell className="text-right">{formatMontant(facture.montant)}</TableCell>
      <TableCell><StatusBadge status={facture.status} /></TableCell>
      <TableCell className="text-right">
        <FactureActions 
          facture={facture} 
          onDeleteInvoice={onDeleteInvoice} 
          onPaiementClick={onPaiementClick}
        />
      </TableCell>
    </TableRow>
  );
};
