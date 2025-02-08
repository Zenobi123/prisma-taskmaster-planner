
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollaborateurForm } from "./CollaborateurForm";
import { CollaborateurRole, CollaborateurPermissions } from "@/types/collaborateur";

interface CollaborateurDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  collaborateur: {
    nom: string;
    prenom: string;
    email: string;
    poste: CollaborateurRole;
    telephone: string;
    niveauetude: string;
    dateentree: string;
    datenaissance: string;
    statut: string;
    ville: string;
    quartier: string;
    permissions: CollaborateurPermissions[];
  };
  onChange: (field: string, value: any) => void;
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
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Ajouter un nouveau collaborateur</DialogTitle>
          <DialogDescription>
            Remplissez les informations du nouveau collaborateur ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)] px-6 pb-6">
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
