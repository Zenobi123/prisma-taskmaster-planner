
import { Facture } from "@/types/facture";
import { TableCell, TableRow } from "@/components/ui/table";
import { FactureStatusDropdown } from "./FactureStatusDropdown";
import { FactureRowActions } from "./FactureRowActions";

interface FactureTableRowProps {
  facture: Facture;
  formatMontant: (montant: number) => string;
  onViewDetails: (facture: Facture) => void;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => void;
  onEditInvoice: (facture: Facture) => void;
  onDeleteInvoice: (factureId: string) => void;
}

export const FactureTableRow = ({
  facture,
  formatMontant,
  onViewDetails,
  onPrintInvoice,
  onDownloadInvoice,
  onUpdateStatus,
  onEditInvoice,
  onDeleteInvoice,
}: FactureTableRowProps) => {
  return (
    <TableRow 
      key={facture.id} 
      className="group hover:bg-neutral-50 transition-all duration-300 animate-fade-in"
    >
      <TableCell className="font-medium">{facture.id}</TableCell>
      <TableCell>{facture.client.nom}</TableCell>
      <TableCell className="whitespace-nowrap hidden md:table-cell">{facture.date}</TableCell>
      <TableCell className="whitespace-nowrap hidden md:table-cell">{facture.echeance}</TableCell>
      <TableCell className="min-w-32">{formatMontant(facture.montant)}</TableCell>
      <TableCell>
        <FactureStatusDropdown
          status={facture.status}
          factureId={facture.id}
          onUpdateStatus={onUpdateStatus}
        />
      </TableCell>
      <TableCell className="text-right">
        <FactureRowActions
          facture={facture}
          onViewDetails={onViewDetails}
          onPrintInvoice={onPrintInvoice}
          onDownloadInvoice={onDownloadInvoice}
          onEditInvoice={onEditInvoice}
          onDeleteInvoice={onDeleteInvoice}
        />
      </TableCell>
    </TableRow>
  );
};
