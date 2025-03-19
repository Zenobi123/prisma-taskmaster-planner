import { Facture } from "@/types/facture";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { FactureDetailsHeader } from "./factureDetails/FactureDetailsHeader";
import { ClientDateInfo } from "./factureDetails/ClientDateInfo";
import { PrestationsTable } from "./factureDetails/PrestationsTable";
import { HistoriquePaiements } from "./factureDetails/HistoriquePaiements";
import { NotesSection } from "./factureDetails/NotesSection";
import { PaiementInfo } from "./factureDetails/PaiementInfo";
import { FactureDetailsFooter } from "./factureDetails/FactureDetailsFooter";

export const FactureDetailsDialog = ({
  showDetails,
  setShowDetails,
  selectedFacture,
  formatMontant,
  onPrintInvoice,
  onDownloadInvoice,
  onUpdateStatus,
  onEditInvoice,
  onDeleteInvoice,
  isAdmin = false,
}: {
  showDetails: boolean;
  setShowDetails: (value: boolean) => void;
  selectedFacture: Facture | null;
  formatMontant: (montant: number) => string;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => void;
  onEditInvoice?: (facture: Facture) => void;
  onDeleteInvoice?: (factureId: string) => void;
  isAdmin?: boolean;
}) => {
  if (!selectedFacture) return null;

  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <FactureDetailsHeader
          selectedFacture={selectedFacture}
          onPrintInvoice={onPrintInvoice}
          onDownloadInvoice={onDownloadInvoice}
          onUpdateStatus={onUpdateStatus}
          onEditInvoice={onEditInvoice}
          onDeleteInvoice={onDeleteInvoice}
          isAdmin={isAdmin}
        />

        <ClientDateInfo selectedFacture={selectedFacture} />

        <div className="space-y-6">
          <PrestationsTable 
            prestations={selectedFacture.prestations} 
            formatMontant={formatMontant} 
          />

          {selectedFacture.paiements && selectedFacture.paiements.length > 0 && (
            <HistoriquePaiements 
              paiements={selectedFacture.paiements} 
              formatMontant={formatMontant} 
            />
          )}

          <NotesSection notes={selectedFacture.notes} />

          <PaiementInfo 
            selectedFacture={selectedFacture} 
            formatMontant={formatMontant} 
          />
        </div>

        <FactureDetailsFooter selectedFacture={selectedFacture} formatMontant={formatMontant} />
      </DialogContent>
    </Dialog>
  );
};
