
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClientType, RegimeFiscalPhysique, RegimeFiscalMorale } from "@/types/client";
import { useState, useEffect } from "react";

interface TaxRegimeFieldsProps {
  type: ClientType;
  regimefiscal?: RegimeFiscalPhysique | RegimeFiscalMorale;
  onChange: (name: string, value: any) => void;
}

export function TaxRegimeFields({ type, regimefiscal, onChange }: TaxRegimeFieldsProps) {
  // Use internal state to ensure the radio buttons update correctly
  const [selectedValue, setSelectedValue] = useState<string>(
    regimefiscal || (type === "physique" ? "reel" : "simplifie")
  );
  
  // Update internal state when props change
  useEffect(() => {
    if (regimefiscal) {
      setSelectedValue(regimefiscal);
    } else {
      setSelectedValue(type === "physique" ? "reel" : "simplifie");
    }
  }, [regimefiscal, type]);
  
  const handleValueChange = (value: string) => {
    // Update internal state
    setSelectedValue(value);
    
    // Send change to parent component
    console.log("Selected tax regime:", value);
    onChange("regimefiscal", value);
  };

  if (type === "physique") {
    return (
      <div>
        <Label className="mb-2 block">Régime fiscal</Label>
        <RadioGroup
          value={selectedValue}
          onValueChange={handleValueChange}
          className="grid grid-cols-2 gap-4"
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
