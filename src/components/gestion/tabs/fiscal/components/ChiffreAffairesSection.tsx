
import { useState, useEffect, ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CGAClasse } from "@/hooks/fiscal/types";
import { formatNumberWithSpaces, parseFormattedNumber } from "@/utils/formatUtils";

interface ChiffreAffairesSectionProps {
  chiffreAffaires?: number;
  onChange: (value: number) => void;
  onClasseChange: (classe: CGAClasse) => void;
}

export function ChiffreAffairesSection({ 
  chiffreAffaires = 0, 
  onChange,
  onClasseChange
}: ChiffreAffairesSectionProps) {
  // État local pour gérer la valeur affichée
  const [displayValue, setDisplayValue] = useState("");

  // Mettre à jour l'état local quand la prop change
  useEffect(() => {
    // N'appliquer le formatage que si chiffreAffaires est défini et non nul
    if (chiffreAffaires > 0) {
      setDisplayValue(formatNumberWithSpaces(chiffreAffaires));
    } else {
      setDisplayValue("");
    }
  }, [chiffreAffaires]);

  const determineClasse = (ca: number): CGAClasse => {
    if (ca < 500000) return "classe1";
    if (ca < 1000000) return "classe2";
    if (ca < 1500000) return "classe3";
    if (ca < 2000000) return "classe4";
    if (ca < 2500000) return "classe5";
    if (ca < 5000000) return "classe6";
    if (ca < 10000000) return "classe7";
    if (ca < 20000000) return "classe8";
    if (ca < 30000000) return "classe9";
    return "classe10";
  };

  const handleChiffreAffairesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Mettre à jour l'affichage local immédiatement
    setDisplayValue(value);
    
    // Convertir la valeur en nombre
    const parsedValue = parseFormattedNumber(value);
    
    // Mettre à jour avec la valeur numérique
    onChange(parsedValue);
    
    // Déterminer la classe basée sur la nouvelle valeur
    onClasseChange(determineClasse(parsedValue));
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div>
        <Label htmlFor="chiffreAffaires">
          Chiffre d'affaires de l'année précédente (FCFA)
        </Label>
        <Input
          id="chiffreAffaires"
          type="text"
          value={displayValue}
          onChange={handleChiffreAffairesChange}
          placeholder="0"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Cette valeur est la somme des chiffres d'affaires de tous les établissements
        </p>
      </div>
    </div>
  );
}
