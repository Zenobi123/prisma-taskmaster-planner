
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
  console.log("TaxRegimeFields - Initial regime fiscal:", regimefiscal);
  console.log("TaxRegimeFields - Client type:", type);
  
  // Définir une valeur par défaut basée sur le type de client
  const defaultValue = type === "physique" ? "reel" as RegimeFiscalPhysique : "simplifie" as RegimeFiscalMorale;
  
  // Utiliser la valeur passée ou la valeur par défaut si non définie
  const [selectedValue, setSelectedValue] = useState<RegimeFiscal>(
    (regimefiscal as RegimeFiscal) || defaultValue
  );
  
  // Mettre à jour la sélection interne lorsque les props changent
  useEffect(() => {
    console.log("TaxRegimeFields useEffect triggered");
    console.log("Current regimefiscal prop:", regimefiscal);
    console.log("Current selectedValue state:", selectedValue);
    
    if (regimefiscal) {
      console.log("TaxRegimeFields: Mise à jour depuis props vers", regimefiscal);
      setSelectedValue(regimefiscal as RegimeFiscal);
      
      // Ne pas déclencher onChange ici pour éviter les boucles infinies
    } else {
      console.log("TaxRegimeFields: Utilisation de la valeur par défaut", defaultValue);
      setSelectedValue(defaultValue);
      
      // Initialiser avec la valeur par défaut si aucune n'est fournie
      onChange("regimefiscal", defaultValue);
    }
  }, [regimefiscal, type, defaultValue]);
  
  const handleValueChange = (value: string) => {
    console.log("Régime fiscal sélectionné changé pour:", value);
    
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
            <RadioGroupItem value="reel" id="reel" />
            <Label htmlFor="reel" className="cursor-pointer">Réel</Label>
          </div>
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
          <RadioGroupItem value="reel" id="reel_morale" />
          <Label htmlFor="reel_morale" className="cursor-pointer">Réel</Label>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem value="simplifie" id="simplifie_morale" />
          <Label htmlFor="simplifie_morale" className="cursor-pointer">Simplifié</Label>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem value="non_lucratif" id="non_lucratif" />
          <Label htmlFor="non_lucratif" className="cursor-pointer">Organisme à but non lucratif</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
