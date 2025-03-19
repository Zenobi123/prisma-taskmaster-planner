
import { Facture } from "@/types/facture";
import { TableCell, TableRow } from "@/components/ui/table";
import { FactureStatusDropdown } from "./FactureStatusDropdown";
import { FactureRowActions } from "./FactureRowActions";
import { Progress } from "@/components/ui/progress";

interface FactureTableRowProps {
  facture: Facture;
  formatMontant: (montant: number) => string;
  onViewDetails: (facture: Facture) => void;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => void;
  onEditInvoice: (facture: Facture) => void;
  onDeleteInvoice: (factureId: string) => void;
  isAdmin?: boolean;
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
  isAdmin = false,
}: FactureTableRowProps) => {
  // Calculer le montant restant et le pourcentage payé pour les factures partiellement payées
  const montantPaye = facture.montantPaye || 0;
  const montantRestant = facture.montant - montantPaye;
  const pourcentagePaye = (montantPaye / facture.montant) * 100;
  
  return (
    <TableRow 
      key={facture.id} 
      className="group hover:bg-neutral-50 transition-all duration-300 animate-fade-in"
    >
      <TableCell className="font-medium">{facture.id}</TableCell>
      <TableCell>{facture.client.nom}</TableCell>
      <TableCell className="whitespace-nowrap hidden md:table-cell">{facture.date}</TableCell>
      <TableCell className="whitespace-nowrap hidden md:table-cell">{facture.echeance}</TableCell>
      <TableCell className="min-w-32">
        {formatMontant(facture.montant)}
        {facture.status === 'partiellement_payée' && (
          <div className="mt-1 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{formatMontant(montantPaye)} payés</span>
              <span className="font-medium">{Math.round(pourcentagePaye)}%</span>
            </div>
            <Progress value={pourcentagePaye} className="h-1.5" />
          </div>
        )}
      </TableCell>
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
          isAdmin={isAdmin}
        />
      </TableCell>
    </TableRow>
  );
};
