import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateFactureForm } from "/dev-server/src/components/facturation/factures/CreateFactureForm";
import { Facture } from "@/types/facture";

interface EditFactureDialogProps {
  facture: Facture | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditFactureDialog = ({ facture, open, onOpenChange, onSuccess }: EditFactureDialogProps) => {
  if (!facture) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Modifier la facture {facture.id}</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la facture.
          </DialogDescription>
        </DialogHeader>
        <CreateFactureForm 
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
          editMode={true}
          factureToEdit={facture}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditFactureDialog;
