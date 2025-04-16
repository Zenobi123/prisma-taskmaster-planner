
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Etablissement } from "@/types/client";
import { formatNumberWithSpaces } from "@/utils/formatUtils";
import { useState, useEffect } from "react";

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
  // Utiliser un état local pour gérer la valeur affichée du chiffre d'affaires
  const [caDisplayValue, setCaDisplayValue] = useState(
    formatNumberWithSpaces(etablissement.chiffreAffaires || 0)
  );
  
  // Mettre à jour l'état local lorsque la prop change
  useEffect(() => {
    setCaDisplayValue(formatNumberWithSpaces(etablissement.chiffreAffaires || 0));
  }, [etablissement.chiffreAffaires]);
  
  // Fonction pour gérer la saisie du chiffre d'affaires
  const handleChiffreAffairesChange = (value: string) => {
    // Mettre à jour l'affichage local
    setCaDisplayValue(value);
    
    // Nettoyer la valeur et la convertir en nombre pour l'état parent
    const numericValue = value.replace(/\s/g, "");
    const parsedValue = Number(numericValue) || 0;
    
    // Mettre à jour l'état parent avec la valeur numérique
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
          value={caDisplayValue}
          onChange={(e) => handleChiffreAffairesChange(e.target.value)}
        />
      </div>
    </div>
  );
}
