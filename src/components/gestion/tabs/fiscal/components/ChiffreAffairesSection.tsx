
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CGAClasse } from "@/hooks/fiscal/types";
import { formatNumberWithSpaces } from "@/utils/formatUtils";

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
  const [localValue, setLocalValue] = useState(chiffreAffaires ? formatNumberWithSpaces(chiffreAffaires) : "0");

  useEffect(() => {
    setLocalValue(chiffreAffaires ? formatNumberWithSpaces(chiffreAffaires) : "0");
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

  const handleChiffreAffairesChange = (value: string) => {
    setLocalValue(value);
    const numValue = Number(value.replace(/\s/g, "")) || 0;
    onChange(numValue);
    onClasseChange(determineClasse(numValue));
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
          value={localValue}
          onChange={(e) => handleChiffreAffairesChange(e.target.value)}
          placeholder="0"
          className="mt-1"
        />
      </div>
    </div>
  );
}
