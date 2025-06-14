
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateFactureForm from "./CreateFactureForm";
import { Facture } from "@/types/facture";

interface EditFactureDialogProps {
  facture: Facture | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedFactureId: string) => void;
}

const EditFactureDialog = ({ facture, open, onOpenChange, onSuccess }: EditFactureDialogProps) => {
  if (!facture) return null;
  
  const handleSuccess = (updatedFactureId: Facture | string) => {
    onSuccess(typeof updatedFactureId === 'string' ? updatedFactureId : updatedFactureId.id);
    onOpenChange(false);
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
          open={open}
          onOpenChange={onOpenChange}
          onFactureCreated={() => handleSuccess(facture.id)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditFactureDialog;
