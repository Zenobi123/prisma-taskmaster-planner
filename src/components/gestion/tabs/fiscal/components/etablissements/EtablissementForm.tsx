
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Etablissement } from "@/types/client";
import { formatNumberWithSpaces } from "@/utils/formatUtils";
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
  // Utiliser un état local pour gérer la valeur affichée du chiffre d'affaires
  const [caDisplayValue, setCaDisplayValue] = useState("");
  
  // États locaux pour chaque champ texte pour une réactivité immédiate
  const [nomValue, setNomValue] = useState(etablissement.nom || "");
  const [activiteValue, setActiviteValue] = useState(etablissement.activite || "");
  const [villeValue, setVilleValue] = useState(etablissement.ville || "");
  const [departementValue, setDepartementValue] = useState(etablissement.departement || "");
  const [quartierValue, setQuartierValue] = useState(etablissement.quartier || "");
  
  // Mettre à jour les états locaux lorsque les props changent
  useEffect(() => {
    setNomValue(etablissement.nom || "");
    setActiviteValue(etablissement.activite || "");
    setVilleValue(etablissement.ville || "");
    setDepartementValue(etablissement.departement || "");
    setQuartierValue(etablissement.quartier || "");
    
    // N'appliquer le formatage que si chiffreAffaires est défini et non nul
    if (etablissement.chiffreAffaires !== undefined && etablissement.chiffreAffaires !== null) {
      setCaDisplayValue(formatNumberWithSpaces(etablissement.chiffreAffaires));
    } else {
      setCaDisplayValue("");
    }
  }, [etablissement]);
  
  // Fonction pour gérer la saisie du chiffre d'affaires
  const handleChiffreAffairesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Mettre à jour l'affichage local immédiatement
    setCaDisplayValue(value);
    
    // Nettoyer la valeur et la convertir en nombre
    // Supprimer tous les caractères non numériques
    const numericValue = value.replace(/\D/g, "");
    const parsedValue = numericValue ? Number(numericValue) : 0;
    
    // Mettre à jour l'état parent avec la valeur numérique
    updateEtablissement(index, "chiffreAffaires", parsedValue);
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
        />
      </div>
    </div>
  );
}
