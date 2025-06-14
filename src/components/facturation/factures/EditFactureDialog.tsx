
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateFactureForm } from "./CreateFactureForm"; // Corrected path
import { Facture } from "@/types/facture";

interface EditFactureDialogProps {
  facture: Facture | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedFactureId: string) => void; // Propagate success event
}

const EditFactureDialog = ({ facture, open, onOpenChange, onSuccess }: EditFactureDialogProps) => {
  if (!facture) return null;
  
  const handleSuccess = (updatedFactureId: Facture | string) => {
    // Assuming onSuccess from parent expects the ID or the full object
    onSuccess(typeof updatedFactureId === 'string' ? updatedFactureId : updatedFactureId.id);
    onOpenChange(false); // Close dialog on success
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

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
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          editMode={true}
          factureToEdit={facture}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditFactureDialog;
