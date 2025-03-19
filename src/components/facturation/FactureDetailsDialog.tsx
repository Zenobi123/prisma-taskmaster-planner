
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Facture } from "@/types/facture";
import { FactureDetailsHeader } from "./factureDetails/FactureDetailsHeader";
import { ClientDateInfo } from "./factureDetails/ClientDateInfo";
import { PrestationsTable } from "./factureDetails/PrestationsTable";
import { PaiementInfo } from "./factureDetails/PaiementInfo";
import { NotesSection } from "./factureDetails/NotesSection";
import { HistoriquePaiements } from "./factureDetails/HistoriquePaiements";
import { FactureDetailsFooter } from "./factureDetails/FactureDetailsFooter";

interface FactureDetailsDialogProps {
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  selectedFacture: Facture | null;
  formatMontant: (montant: number) => string;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => void;
  onEditInvoice: (facture: Facture) => void;
  onDeleteInvoice: (factureId: string) => void;
  isAdmin?: boolean;
}

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
}: FactureDetailsDialogProps) => {
  if (!selectedFacture) return null;

  // Calculer le montant total des prestations
  const montantTotal = selectedFacture.prestations.reduce(
    (total, prestation) => total + prestation.montant * prestation.quantite,
    0
  );

  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <FactureDetailsHeader
          selectedFacture={selectedFacture}
          onPrintInvoice={onPrintInvoice}
          onDownloadInvoice={onDownloadInvoice}
          onEditInvoice={onEditInvoice}
          onDeleteInvoice={onDeleteInvoice}
          isAdmin={isAdmin}
        />
        
        <div className="grid grid-cols-1 gap-6">
          <ClientDateInfo 
            client={selectedFacture.client}
            date={selectedFacture.date}
            echeance={selectedFacture.echeance}
          />
          
          <PrestationsTable 
            prestations={selectedFacture.prestations} 
            formatMontant={formatMontant}
            montantTotal={montantTotal}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PaiementInfo 
              status={selectedFacture.status}
              montant={selectedFacture.montant}
              montantPaye={selectedFacture.montantPaye || 0}
              modeReglement={selectedFacture.modeReglement}
              moyenPaiement={selectedFacture.moyenPaiement}
              formatMontant={formatMontant}
            />
            
            {selectedFacture.notes && (
              <NotesSection notes={selectedFacture.notes} />
            )}
          </div>
          
          {selectedFacture.paiements && selectedFacture.paiements.length > 0 && (
            <HistoriquePaiements 
              historiquePaiements={selectedFacture.paiements}
              formatMontant={formatMontant} 
            />
          )}
          
          <FactureDetailsFooter
            factureId={selectedFacture.id}
            status={selectedFacture.status}
            montant={selectedFacture.montant}
            formatMontant={formatMontant}
            onUpdateStatus={onUpdateStatus}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
