
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Facture } from "@/types/facture";
import UpdateFactureForm from "./UpdateFactureForm";

interface UpdateFactureDialogProps {
  facture: Facture;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedData: Partial<Facture>) => void;
}

const UpdateFactureDialog = ({
  facture,
  open,
  onOpenChange,
  onSuccess
}: UpdateFactureDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Modifier la facture {facture.id}</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la facture ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <UpdateFactureForm 
          facture={facture}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFactureDialog;
