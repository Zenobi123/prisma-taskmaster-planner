
import { Facture } from "@/types/facture";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientDateInfo } from "./ClientDateInfo";
import { PrestationsTable } from "./PrestationsTable";
import { NotesSection } from "./NotesSection";

interface FactureDetailsContentProps {
  selectedFacture: Facture;
  formatMontant: (montant: number) => string;
  canEdit: boolean;
  onEnterEditMode: () => void;
  onClose: () => void;
}

export const FactureDetailsContent = ({
  selectedFacture,
  formatMontant,
  canEdit,
  onEnterEditMode,
  onClose,
}: FactureDetailsContentProps) => {
  return (
    <>
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

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
        
        {canEdit && (
          <Button onClick={onEnterEditMode}>
            Modifier
          </Button>
        )}
      </div>
    </>
  );
};
