
import { Facture } from "@/types/facture";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FactureTableHeader } from "./table/FactureTableHeader";
import { FactureTableFooter } from "./table/FactureTableFooter";
import { FactureTableEmptyState } from "./table/FactureTableEmptyState";
import { FactureTableRow } from "./table/FactureTableRow";

interface FactureTableProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
  onViewDetails: (facture: Facture) => void;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => void;
  onEditInvoice: (facture: Facture) => void;
  onDeleteInvoice: (factureId: string) => Promise<boolean> | void;
  isAdmin?: boolean;
}

export const FactureTable = ({
  factures,
  formatMontant,
  onViewDetails,
  onPrintInvoice,
  onDownloadInvoice,
  onUpdateStatus,
  onEditInvoice,
  onDeleteInvoice,
  isAdmin = false,
}: FactureTableProps) => {
  // Calculate total amount of invoices
  const totalMontant = factures.reduce((sum, facture) => sum + facture.montant, 0);
  
  return (
    <Card className="mb-6 animate-fade-in shadow-sm hover:shadow transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Liste des factures</CardTitle>
        <CardDescription>
          {factures.length} facture(s) trouvée(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <FactureTableHeader />
            <TableBody>
              {factures.length === 0 ? (
                <FactureTableEmptyState />
              ) : (
                factures.map((facture) => (
                  <FactureTableRow
                    key={facture.id}
                    facture={facture}
                    formatMontant={formatMontant}
                    onViewDetails={onViewDetails}
                    onPrintInvoice={onPrintInvoice}
                    onDownloadInvoice={onDownloadInvoice}
                    onUpdateStatus={onUpdateStatus}
                    onEditInvoice={onEditInvoice}
                    onDeleteInvoice={onDeleteInvoice}
                    isAdmin={isAdmin}
                  />
                ))
              )}
            </TableBody>
            {factures.length > 0 && (
              <FactureTableFooter 
                totalMontant={totalMontant} 
                formatMontant={formatMontant} 
              />
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// Export the StatusBadge component for use in other components
export { StatusBadge } from "./table/StatusBadge";
