import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClientType, RegimeFiscalPhysique, RegimeFiscalMorale, RegimeFiscal } from "@/types/client";
import { useState, useEffect } from "react";

interface TaxRegimeFieldsProps {
  type: ClientType;
  regimefiscal?: RegimeFiscalPhysique | RegimeFiscalMorale;
  onChange: (name: string, value: any) => void;
}

export function TaxRegimeFields({ type, regimefiscal, onChange }: TaxRegimeFieldsProps) {
  // Toujours définir IGS comme valeur par défaut pour les personnes physiques
  const defaultValue = type === "physique" ? "igs" as RegimeFiscalPhysique : "non_lucratif" as RegimeFiscalMorale;
  
  const [selectedValue, setSelectedValue] = useState<RegimeFiscal>(
    (regimefiscal as RegimeFiscal) || defaultValue
  );
  
  useEffect(() => {
    // Toujours initialiser avec IGS pour les personnes physiques si non défini
    if (type === "physique" && (!regimefiscal || regimefiscal !== "igs")) {
      const defaultIGS = "igs" as RegimeFiscalPhysique;
      setSelectedValue(defaultIGS);
      onChange("regimefiscal", defaultIGS);
    }
  }, [type, regimefiscal]);
  
  const handleValueChange = (value: string) => {
    console.log("Regime fiscal selection changed to:", value);
    
    // Vérifier que la valeur est un RegimeFiscal valide
    let typedValue: RegimeFiscal;
    
    if (type === "physique") {
      typedValue = value as RegimeFiscalPhysique;
    } else {
      typedValue = value as RegimeFiscalMorale;
    }
    
    // Mettre à jour l'état interne
    setSelectedValue(typedValue);
    
    // Envoyer le changement au composant parent avec le nom exact du champ
    onChange("regimefiscal", typedValue);
  };

  if (type === "physique") {
    return (
      <div>
        <Label className="mb-2 block">Régime fiscal</Label>
        <RadioGroup
          value={selectedValue}
          onValueChange={handleValueChange}
          className="grid grid-cols-2 gap-4"
          name="regimefiscal"
        >
          <div className="flex items-center space-x-2 cursor-pointer">
            <RadioGroupItem value="igs" id="igs" />
            <Label htmlFor="igs" className="cursor-pointer">IGS</Label>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <RadioGroupItem value="non_professionnel_salarie" id="non_professionnel_salarie" />
            <Label htmlFor="non_professionnel_salarie" className="cursor-pointer">Non professionnel salarié</Label>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <RadioGroupItem value="non_professionnel_autre" id="non_professionnel_autre" />
            <Label htmlFor="non_professionnel_autre" className="cursor-pointer text-sm">Non professionnel (Autres)</Label>
          </div>
        </RadioGroup>
      </div>
    );
  }

  return (
    <div>
      <Label className="mb-2 block">Régime fiscal</Label>
      <RadioGroup
        value={selectedValue}
        onValueChange={handleValueChange}
        className="grid grid-cols-1 gap-4"
        name="regimefiscal"
      >
        <div className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem value="non_lucratif" id="non_lucratif" />
          <Label htmlFor="non_lucratif" className="cursor-pointer">Organisme à but non lucratif</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
