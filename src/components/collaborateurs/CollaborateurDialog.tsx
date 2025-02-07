
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollaborateurForm } from "./CollaborateurForm";

interface CollaborateurDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  collaborateur: {
    nom: string;
    prenom: string;
    email: string;
    poste: string;
    telephone: string;
    niveauEtude: string;
    dateEntree: string;
    dateNaissance: string;
    statut: string;
    ville: string;
    quartier: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CollaborateurDialog({
  isOpen,
  onOpenChange,
  collaborateur,
  onChange,
  onSubmit,
}: CollaborateurDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau collaborateur</DialogTitle>
          <DialogDescription>
            Remplissez les informations du nouveau collaborateur ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <CollaborateurForm
            collaborateur={collaborateur}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
