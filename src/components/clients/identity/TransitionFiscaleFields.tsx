
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
import { FileText, CreditCard } from "lucide-react";
import { calculateIGSAmount, formatAmount, getCAFourchette } from "@/utils/igsRatesUtil";

interface TransitionFiscaleFieldsProps {
  transitionFiscale?: TransitionFiscaleData;
  onChange: (name: string, value: any) => void;
}

export function TransitionFiscaleFields({ transitionFiscale, onChange }: TransitionFiscaleFieldsProps) {
  const [showCgaOptions, setShowCgaOptions] = useState<boolean>(false);
  const [showClasseOptions, setShowClasseOptions] = useState<boolean>(false);
  const [igsAmount, setIgsAmount] = useState<number | undefined>(undefined);
  
  // Generate class options 1-10
  const classeOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  // Set initial states based on the provided data
  useEffect(() => {
    // Convert to boolean to ensure correct type
    const isAssujetti = Boolean(transitionFiscale?.igsAssujetissement);
    
    console.log("Initial isAssujetti value:", isAssujetti);
    console.log("Raw igsAssujetissement value:", transitionFiscale?.igsAssujetissement);
    
    setShowCgaOptions(isAssujetti);
    setShowClasseOptions(isAssujetti);
    
    // Initialize amount if we have all the necessary data
    if (isAssujetti && transitionFiscale?.classeIGS) {
      const amount = calculateIGSAmount(
        transitionFiscale.classeIGS,
        Boolean(transitionFiscale.cgaAdhesion)
      );
      setIgsAmount(amount);
    }
  }, [transitionFiscale]);

  // Calculate IGS amount when classeIGS or cgaAdhesion changes
  useEffect(() => {
    if (Boolean(transitionFiscale?.igsAssujetissement)) {
      const amount = calculateIGSAmount(
        transitionFiscale?.classeIGS,
        Boolean(transitionFiscale?.cgaAdhesion)
      );
      setIgsAmount(amount);
      onChange("transitionFiscale.montant", amount);
    } else {
      setIgsAmount(undefined);
      onChange("transitionFiscale.montant", undefined);
    }
  }, [transitionFiscale?.classeIGS, transitionFiscale?.cgaAdhesion, transitionFiscale?.igsAssujetissement, onChange]);

  const handleIGSChange = (value: string) => {
    const isAssujetti = value === "true";
    
    console.log("Setting igsAssujetissement to:", isAssujetti);
    
    onChange("transitionFiscale.igsAssujetissement", isAssujetti);
    
    setShowCgaOptions(isAssujetti);
    setShowClasseOptions(isAssujetti);
    
    // If IGS is set to No, reset other fields
    if (!isAssujetti) {
      onChange("transitionFiscale.cgaAdhesion", undefined);
      onChange("transitionFiscale.classeIGS", undefined);
      onChange("transitionFiscale.montant", undefined);
      setIgsAmount(undefined);
    }
  };

  const handleCgaChange = (value: string) => {
    const isMember = value === "true";
    console.log("Setting cgaAdhesion to:", isMember);
    onChange("transitionFiscale.cgaAdhesion", isMember);
  };

  const handleClasseChange = (value: string) => {
    const classeValue = parseInt(value);
    console.log("Setting classeIGS to:", classeValue);
    onChange("transitionFiscale.classeIGS", classeValue);
  };

  // For debugging
  console.log("TransitionFiscale state:", {
    igsAssujetissement: transitionFiscale?.igsAssujetissement,
    cgaAdhesion: transitionFiscale?.cgaAdhesion,
    classeIGS: transitionFiscale?.classeIGS,
    montant: igsAmount,
    showCgaOptions,
    showClasseOptions
  });

  const igsValue = transitionFiscale?.igsAssujetissement === true ? "true" : 
                   transitionFiscale?.igsAssujetissement === false ? "false" : undefined;
                   
  const cgaValue = transitionFiscale?.cgaAdhesion === true ? "true" : 
                   transitionFiscale?.cgaAdhesion === false ? "false" : undefined;
  
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
            value={igsValue}
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
              value={cgaValue}
              onValueChange={handleCgaChange}
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
              onValueChange={handleClasseChange}
            >
              <SelectTrigger id="classe-igs" className="w-full">
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                {classeOptions.map((classe) => (
                  <SelectItem key={classe} value={classe.toString()}>
                    Classe {classe} - {getCAFourchette(classe)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showClasseOptions && transitionFiscale?.classeIGS && (
          <div className="rounded-md bg-slate-50 p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard size={16} className="text-primary" />
              <h4 className="font-medium">Montant IGS</h4>
            </div>
            <div className="text-lg font-semibold text-primary">
              {formatAmount(igsAmount)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {transitionFiscale?.cgaAdhesion ? "Montant réduit (membre CGA)" : "Montant standard (non-membre CGA)"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
