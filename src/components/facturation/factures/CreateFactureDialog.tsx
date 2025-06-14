
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateFactureForm } from "./CreateFactureForm"; // Corrected path
import { Facture } from "@/types/facture";

const CreateFactureDialog = () => {
  const [open, setOpen] = useState(false);

  const handleSuccess = (newFacture: Facture | string) => {
    console.log("Facture créée/mise à jour:", newFacture);
    setOpen(false);
    // Potentially trigger a refetch of factures list here
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#84A98C] hover:bg-[#6B8E74] shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Nouvelle facture
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle facture.
          </DialogDescription>
        </DialogHeader>
        <CreateFactureForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel}
          editMode={false} // Explicitly set editMode to false for creation
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateFactureDialog;
