
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransitionFiscaleData } from "@/hooks/fiscal/types";
import { FileText } from "lucide-react";

interface TransitionFiscaleFieldsProps {
  transitionFiscale?: TransitionFiscaleData;
  onChange: (name: string, value: any) => void;
}

export function TransitionFiscaleFields({ transitionFiscale, onChange }: TransitionFiscaleFieldsProps) {
  const [showCgaOptions, setShowCgaOptions] = useState(transitionFiscale?.igsAssujetissement || false);
  const [showClasseOptions, setShowClasseOptions] = useState(transitionFiscale?.igsAssujetissement || false);
  
  // Generate class options 1-10
  const classeOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    setShowCgaOptions(transitionFiscale?.igsAssujetissement || false);
    setShowClasseOptions(transitionFiscale?.igsAssujetissement || false);
  }, [transitionFiscale?.igsAssujetissement]);

  const handleIGSChange = (value: string) => {
    const isAssujetti = value === "true";
    onChange("transitionFiscale.igsAssujetissement", isAssujetti);
    
    setShowCgaOptions(isAssujetti);
    setShowClasseOptions(isAssujetti);
    
    // If IGS is set to No, reset other fields
    if (!isAssujetti) {
      onChange("transitionFiscale.cgaAdhesion", undefined);
      onChange("transitionFiscale.classeIGS", undefined);
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <div className="flex items-center gap-2 border-b pb-2 mb-4">
        <FileText size={18} className="text-muted-foreground" />
        <h3 className="font-medium">Transition fiscale</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Impôts Général Synthétique (IGS)</Label>
          <RadioGroup
            value={transitionFiscale?.igsAssujetissement?.toString()}
            onValueChange={handleIGSChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="igs-true" />
              <Label htmlFor="igs-true">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="igs-false" />
              <Label htmlFor="igs-false">Non</Label>
            </div>
          </RadioGroup>
        </div>

        {showCgaOptions && (
          <div>
            <Label className="mb-2 block">Membre de CGA ?</Label>
            <RadioGroup
              value={transitionFiscale?.cgaAdhesion?.toString()}
              onValueChange={(value) => onChange("transitionFiscale.cgaAdhesion", value === "true")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="cga-true" />
                <Label htmlFor="cga-true">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="cga-false" />
                <Label htmlFor="cga-false">Non</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {showClasseOptions && (
          <div>
            <Label htmlFor="classe-igs">Classe IGS (1-10)</Label>
            <Select
              value={transitionFiscale?.classeIGS?.toString()}
              onValueChange={(value) => onChange("transitionFiscale.classeIGS", parseInt(value))}
            >
              <SelectTrigger id="classe-igs" className="w-full">
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                {classeOptions.map((classe) => (
                  <SelectItem key={classe} value={classe.toString()}>
                    Classe {classe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
