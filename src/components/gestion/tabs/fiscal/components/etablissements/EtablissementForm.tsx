
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Etablissement } from "@/types/client";
import { formatNumberWithSpaces, parseFormattedNumber } from "@/utils/formatUtils";
import { useState, useEffect, ChangeEvent } from "react";

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
  // États locaux pour chaque champ texte pour une réactivité immédiate
  const [nomValue, setNomValue] = useState(etablissement.nom || "");
  const [activiteValue, setActiviteValue] = useState(etablissement.activite || "");
  const [villeValue, setVilleValue] = useState(etablissement.ville || "");
  const [departementValue, setDepartementValue] = useState(etablissement.departement || "");
  const [quartierValue, setQuartierValue] = useState(etablissement.quartier || "");
  const [caDisplayValue, setCaDisplayValue] = useState("");
  
  // Mettre à jour les états locaux lorsque les props changent
  useEffect(() => {
    setNomValue(etablissement.nom || "");
    setActiviteValue(etablissement.activite || "");
    setVilleValue(etablissement.ville || "");
    setDepartementValue(etablissement.departement || "");
    setQuartierValue(etablissement.quartier || "");
    
    // Appliquer le formatage seulement si nécessaire
    if (etablissement.chiffreAffaires > 0) {
      setCaDisplayValue(formatNumberWithSpaces(etablissement.chiffreAffaires));
    } else {
      setCaDisplayValue("");
    }
  }, [etablissement]);
  
  // Fonction pour gérer la saisie du chiffre d'affaires
  const handleChiffreAffairesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Permettre la saisie directe sans interférence de formatage
    setCaDisplayValue(value);
    
    // Convertir la valeur en nombre uniquement lorsqu'on met à jour les données parent
    const numericValue = parseFormattedNumber(value);
    
    // Mettre à jour l'état parent avec la valeur numérique
    updateEtablissement(index, "chiffreAffaires", numericValue);
  };

  // Gérer les changements pour les champs texte avec mise à jour immédiate de l'interface
  const handleTextInputChange = (field: keyof Etablissement, value: string, stateSetter: (value: string) => void) => {
    // Mettre à jour l'état local pour une réactivité immédiate
    stateSetter(value);
    
    // Mettre à jour l'état parent
    updateEtablissement(index, field, value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor={`nom-${index}`}>Nom Commercial</Label>
        <Input
          id={`nom-${index}`}
          value={nomValue}
          onChange={(e) => handleTextInputChange("nom", e.target.value, setNomValue)}
        />
      </div>
      <div>
        <Label htmlFor={`activite-${index}`}>Activité</Label>
        <Input
          id={`activite-${index}`}
          value={activiteValue}
          onChange={(e) => handleTextInputChange("activite", e.target.value, setActiviteValue)}
        />
      </div>
      <div>
        <Label htmlFor={`ville-${index}`}>Ville</Label>
        <Input
          id={`ville-${index}`}
          value={villeValue}
          onChange={(e) => handleTextInputChange("ville", e.target.value, setVilleValue)}
        />
      </div>
      <div>
        <Label htmlFor={`departement-${index}`}>Département</Label>
        <Input
          id={`departement-${index}`}
          value={departementValue}
          onChange={(e) => handleTextInputChange("departement", e.target.value, setDepartementValue)}
        />
      </div>
      <div>
        <Label htmlFor={`quartier-${index}`}>Quartier</Label>
        <Input
          id={`quartier-${index}`}
          value={quartierValue}
          onChange={(e) => handleTextInputChange("quartier", e.target.value, setQuartierValue)}
        />
      </div>
      <div>
        <Label htmlFor={`ca-${index}`}>Chiffre d'affaires HT (FCFA)</Label>
        <Input
          id={`ca-${index}`}
          value={caDisplayValue}
          onChange={handleChiffreAffairesChange}
          placeholder="0"
          type="text"
        />
      </div>
    </div>
  );
}
