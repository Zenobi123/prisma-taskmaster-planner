import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CollaborateurFormProps {
  collaborateur: {
    nom: string;
    prenom: string;
    email: string;
    poste: string;
    telephone: string;
    niveauEtude: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CollaborateurForm({ collaborateur, onChange, onSubmit }: CollaborateurFormProps) {
  const niveauxEtude = [
    "Bac",
    "Bac+2",
    "Bac+3",
    "Bac+4",
    "Bac+5",
    "Doctorat"
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Nom</label>
        <Input
          value={collaborateur.nom}
          onChange={(e) => onChange("nom", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Prénom</label>
        <Input
          value={collaborateur.prenom}
          onChange={(e) => onChange("prenom", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Email</label>
        <Input
          type="email"
          value={collaborateur.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Téléphone</label>
        <Input
          type="tel"
          value={collaborateur.telephone}
          onChange={(e) => onChange("telephone", e.target.value)}
          required
          placeholder="06 12 34 56 78"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Poste</label>
        <Input
          value={collaborateur.poste}
          onChange={(e) => onChange("poste", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Niveau d'étude</label>
        <Select
          value={collaborateur.niveauEtude}
          onValueChange={(value) => onChange("niveauEtude", value)}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Sélectionnez un niveau d'étude" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {niveauxEtude.map((niveau) => (
              <SelectItem key={niveau} value={niveau}>
                {niveau}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-hover text-white"
      >
        Ajouter le collaborateur
      </Button>
    </form>
  );
}