
import { Facture } from "@/types/facture";
import { FactureTable } from "@/components/facturation/FactureTable";

interface FacturesTableProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
  onViewDetails: (facture: Facture) => void;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onDeleteFacture: (factureId: string) => void;
  isLoading: boolean;
}

export const FacturesTable = ({
  factures,
  formatMontant,
  onViewDetails,
  onPrintInvoice,
  onDownloadInvoice,
  onDeleteFacture,
  isLoading,
}: FacturesTableProps) => {
  return (
    <FactureTable
      factures={factures}
      formatMontant={formatMontant}
      onViewDetails={onViewDetails}
      onPrintInvoice={onPrintInvoice}
      onDownloadInvoice={onDownloadInvoice}
      onDeleteFacture={onDeleteFacture}
      isLoading={isLoading}
    />
  );
};
