
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
import CreateFactureForm from "./CreateFactureForm";
import { Client } from "@/types/client";

interface CreateFactureDialogProps {
  clients?: Client[];
  onFactureCreated?: () => void;
}

const CreateFactureDialog = ({ clients = [], onFactureCreated }: CreateFactureDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onFactureCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#84A98C] hover:bg-[#6B8E74] shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Nouvelle facture
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle facture.
          </DialogDescription>
        </DialogHeader>
        <CreateFactureForm
          open={open}
          onOpenChange={setOpen}
          onFactureCreated={handleSuccess}
          clients={clients}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateFactureDialog;
