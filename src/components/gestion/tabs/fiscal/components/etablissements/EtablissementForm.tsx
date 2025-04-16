
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Etablissement } from "@/types/client";
import { formatNumberWithSpaces } from "@/utils/formatUtils";

interface EtablissementFormProps {
  etablissement: Etablissement;
  index: number;
  updateEtablissement: (index: number, field: keyof Etablissement, value: string | number) => void;
}

export function EtablissementForm({ 
  etablissement, 
  index, 
  updateEtablissement 
}: EtablissementFormProps) {
  // Function to handle turnover input, properly parsing the number
  const handleChiffreAffairesChange = (value: string) => {
    // Remove spaces and parse as number
    const numericValue = value.replace(/\s/g, "");
    const parsedValue = Number(numericValue) || 0;
    
    // Update with the numeric value, not the formatted string
    updateEtablissement(index, "chiffreAffaires", parsedValue);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor={`nom-${index}`}>Nom Commercial</Label>
        <Input
          id={`nom-${index}`}
          value={etablissement.nom || ""}
          onChange={(e) => updateEtablissement(index, "nom", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`activite-${index}`}>Activité</Label>
        <Input
          id={`activite-${index}`}
          value={etablissement.activite || ""}
          onChange={(e) => updateEtablissement(index, "activite", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`ville-${index}`}>Ville</Label>
        <Input
          id={`ville-${index}`}
          value={etablissement.ville || ""}
          onChange={(e) => updateEtablissement(index, "ville", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`departement-${index}`}>Département</Label>
        <Input
          id={`departement-${index}`}
          value={etablissement.departement || ""}
          onChange={(e) => updateEtablissement(index, "departement", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`quartier-${index}`}>Quartier</Label>
        <Input
          id={`quartier-${index}`}
          value={etablissement.quartier || ""}
          onChange={(e) => updateEtablissement(index, "quartier", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`ca-${index}`}>Chiffre d'affaires HT (FCFA)</Label>
        <Input
          id={`ca-${index}`}
          value={formatNumberWithSpaces(etablissement.chiffreAffaires || 0)}
          onChange={(e) => handleChiffreAffairesChange(e.target.value)}
        />
      </div>
    </div>
  );
}
