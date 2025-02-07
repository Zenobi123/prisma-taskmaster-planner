
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CollaborateurRole, ModuleAcces, Permission } from "@/types/collaborateur";

interface CollaborateurFormProps {
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

const roles: CollaborateurRole[] = [
  "expert-comptable",
  "assistant",
  "fiscaliste",
  "gestionnaire",
  "comptable",
];

const niveauxEtude = [
  "BAC",
  "BAC+2",
  "BAC+3",
  "BAC+4",
  "BAC+5",
  "BAC+6 et plus"
];

const modules: ModuleAcces[] = [
  "clients",
  "taches",
  "facturation",
  "rapports",
  "planning",
];

const permissions: Permission[] = ["lecture", "ecriture", "administration"];

export function CollaborateurForm({
  collaborateur,
  onChange,
  onSubmit,
}: CollaborateurFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>Nom *</Label>
        <Input
          value={collaborateur.nom}
          onChange={(e) => onChange("nom", e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Prénom *</Label>
        <Input
          value={collaborateur.prenom}
          onChange={(e) => onChange("prenom", e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={collaborateur.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>
      <div>
        <Label>Téléphone</Label>
        <Input
          type="tel"
          value={collaborateur.telephone}
          onChange={(e) => onChange("telephone", e.target.value)}
        />
      </div>
      <div>
        <Label>Rôle</Label>
        <Select
          value={collaborateur.poste}
          onValueChange={(value) => onChange("poste", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1).replace("-", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Niveau d'étude</Label>
        <Select
          value={collaborateur.niveauEtude}
          onValueChange={(value) => onChange("niveauEtude", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un niveau d'étude" />
          </SelectTrigger>
          <SelectContent>
            {niveauxEtude.map((niveau) => (
              <SelectItem key={niveau} value={niveau}>
                {niveau}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Date d'entrée</Label>
        <Input
          type="date"
          value={collaborateur.dateEntree}
          onChange={(e) => onChange("dateEntree", e.target.value)}
        />
      </div>
      <div>
        <Label>Date de naissance</Label>
        <Input
          type="date"
          value={collaborateur.dateNaissance}
          onChange={(e) => onChange("dateNaissance", e.target.value)}
        />
      </div>
      <div>
        <Label>Ville</Label>
        <Input
          value={collaborateur.ville}
          onChange={(e) => onChange("ville", e.target.value)}
        />
      </div>
      <div>
        <Label>Quartier</Label>
        <Input
          value={collaborateur.quartier}
          onChange={(e) => onChange("quartier", e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <Label>Permissions d'accès</Label>
        {modules.map((module) => (
          <div key={module} className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium capitalize">{module}</h4>
            </div>
            <div className="space-x-4 flex items-center">
              {permissions.map((permission) => (
                <label key={permission} className="flex items-center space-x-2">
                  <Checkbox />
                  <span className="text-sm capitalize">{permission}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        Ajouter le collaborateur
      </Button>
    </form>
  );
}
