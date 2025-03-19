
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FactureForm } from "../FactureForm";
import { FactureView } from "../FactureView";
import { PaiementForm } from "../PaiementForm";
import { Facture } from "@/types/facture";

interface FacturesDialogsProps {
  selectedFacture: Facture | null;
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isViewDialogOpen: boolean;
  isAddPaymentDialogOpen: boolean;
  setIsCreateDialogOpen: (isOpen: boolean) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsViewDialogOpen: (isOpen: boolean) => void;
  setIsAddPaymentDialogOpen: (isOpen: boolean) => void;
}

export const FacturesDialogs = ({
  selectedFacture,
  isCreateDialogOpen,
  isEditDialogOpen,
  isViewDialogOpen,
  isAddPaymentDialogOpen,
  setIsCreateDialogOpen,
  setIsEditDialogOpen,
  setIsViewDialogOpen,
  setIsAddPaymentDialogOpen,
}: FacturesDialogsProps) => {
  return (
    <>
      {/* Boîte de dialogue pour créer une facture */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle facture</DialogTitle>
          </DialogHeader>
          <FactureForm 
            onSuccess={() => setIsCreateDialogOpen(false)}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour éditer une facture */}
      {selectedFacture && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Modifier la facture</DialogTitle>
            </DialogHeader>
            <FactureForm 
              factureExistante={selectedFacture}
              onSuccess={() => setIsEditDialogOpen(false)}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Boîte de dialogue pour voir une facture */}
      {selectedFacture && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Détails de la facture</DialogTitle>
            </DialogHeader>
            <FactureView 
              facture={selectedFacture}
              onAddPayment={() => {
                setIsViewDialogOpen(false);
                setIsAddPaymentDialogOpen(true);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Boîte de dialogue pour ajouter un paiement */}
      {selectedFacture && (
        <Dialog open={isAddPaymentDialogOpen} onOpenChange={setIsAddPaymentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un paiement</DialogTitle>
            </DialogHeader>
            <PaiementForm 
              facture={selectedFacture}
              onSuccess={() => setIsAddPaymentDialogOpen(false)}
              onCancel={() => setIsAddPaymentDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
