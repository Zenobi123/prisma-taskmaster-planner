
import { Button } from "@/components/ui/button";
import { CollaborateurRole, CollaborateurPermissions } from "@/types/collaborateur";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { ProfessionalInfoFields } from "./form/ProfessionalInfoFields";
import { AddressFields } from "./form/AddressFields";
import { PermissionsFields } from "./form/PermissionsFields";

interface CollaborateurFormProps {
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

export function CollaborateurForm({
  collaborateur,
  onChange,
  onSubmit,
}: CollaborateurFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PersonalInfoFields
        nom={collaborateur.nom}
        prenom={collaborateur.prenom}
        email={collaborateur.email}
        telephone={collaborateur.telephone}
        datenaissance={collaborateur.datenaissance}
        onChange={onChange}
      />
      
      <ProfessionalInfoFields
        poste={collaborateur.poste}
        niveauetude={collaborateur.niveauetude}
        dateentree={collaborateur.dateentree}
        onChange={onChange}
      />
      
      <AddressFields
        ville={collaborateur.ville}
        quartier={collaborateur.quartier}
        onChange={onChange}
      />
      
      <PermissionsFields
        permissions={collaborateur.permissions}
        onChange={onChange}
      />

      <Button type="submit" className="w-full">
        Ajouter le collaborateur
      </Button>
    </form>
  );
}
