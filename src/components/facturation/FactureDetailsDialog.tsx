
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
            montantTotal={selectedFacture.montant}
          />

          {selectedFacture.paiements && selectedFacture.paiements.length > 0 && (
            <HistoriquePaiements 
              facture={selectedFacture}
              formatMontant={formatMontant} 
            />
          )}

          <NotesSection notes={selectedFacture.notes} />

          <PaiementInfo 
            modeReglement={selectedFacture.modeReglement}
            moyenPaiement={selectedFacture.moyenPaiement}
            status={selectedFacture.status}
            montantPaye={selectedFacture.montantPaye || 0}
            montantTotal={selectedFacture.montant}
            formatMontant={formatMontant} 
          />
        </div>

        <FactureDetailsFooter onClose={() => setShowDetails(false)} />
      </DialogContent>
    </Dialog>
  );
};
