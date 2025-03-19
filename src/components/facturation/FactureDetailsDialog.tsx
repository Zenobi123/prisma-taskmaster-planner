
import { Facture } from "@/types/facture";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FactureDetailsHeader } from "./factureDetails/FactureDetailsHeader";
import { ClientDateInfo } from "./factureDetails/ClientDateInfo";
import { PrestationsTable } from "./factureDetails/PrestationsTable";
import { NotesSection } from "./factureDetails/NotesSection";
import { FactureDetailsFooter } from "./factureDetails/FactureDetailsFooter";

interface FactureDetailsDialogProps {
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  selectedFacture: Facture | null;
  formatMontant: (montant: number) => string;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => void;
}

export const FactureDetailsDialog = ({
  showDetails,
  setShowDetails,
  selectedFacture,
  formatMontant,
  onPrintInvoice,
  onDownloadInvoice,
  onUpdateStatus,
}: FactureDetailsDialogProps) => {
  if (!selectedFacture) return null;

  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <FactureDetailsHeader 
          selectedFacture={selectedFacture}
          onPrintInvoice={onPrintInvoice}
          onDownloadInvoice={onDownloadInvoice}
          onUpdateStatus={onUpdateStatus}
        />

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 animate-fade-in">
            <ClientDateInfo selectedFacture={selectedFacture} />

            <PrestationsTable 
              prestations={selectedFacture.prestations}
              montantTotal={selectedFacture.montant}
              formatMontant={formatMontant}
            />

            <NotesSection notes={selectedFacture.notes} />
          </div>
        </ScrollArea>

        <FactureDetailsFooter onClose={() => setShowDetails(false)} />
      </DialogContent>
    </Dialog>
  );
};
