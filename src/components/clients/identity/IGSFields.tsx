
import { useState, useEffect } from "react";
import { CGAClasse, IGSData, IGSPayment } from "@/types/client";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { IGSClassSelector } from "./igs/IGSClassSelector";
import { IGSAmountDisplay } from "./igs/IGSAmountDisplay";

interface IGSFieldsProps {
  onChange: (name: string, value: any) => void;
  igs?: IGSData;
}

export function IGSFields({ 
  onChange,
  igs 
}: IGSFieldsProps) {
  // Initialize IGS data with defaults or existing values
  const [soumisIGS, setSoumisIGS] = useState<boolean>(igs?.soumisIGS || false);
  const [adherentCGA, setAdherentCGA] = useState<boolean>(igs?.adherentCGA || false);
  const [classeIGS, setClasseIGS] = useState<CGAClasse | undefined>(igs?.classeIGS);

  // Update local state when props change
  useEffect(() => {
    if (igs) {
      setSoumisIGS(igs.soumisIGS || false);
      setAdherentCGA(igs.adherentCGA || false);
      setClasseIGS(igs.classeIGS);
    }
  }, [igs]);

  // Handle changes to IGS data
  const handleSoumisIGSChange = (checked: boolean) => {
    setSoumisIGS(checked);
    
    // Update the parent component
    const updatedIGS: IGSData = {
      soumisIGS: checked,
      adherentCGA,
      classeIGS,
      patente: igs?.patente || { montant: '', quittance: '' },
      acompteJanvier: igs?.acompteJanvier || { montant: '', quittance: '' },
      acompteFevrier: igs?.acompteFevrier || { montant: '', quittance: '' }
    };
    
    onChange("igs", updatedIGS);
  };

  const handleAdherentCGAChange = (checked: boolean) => {
    setAdherentCGA(checked);
    
    // Update the parent component
    const updatedIGS: IGSData = {
      soumisIGS,
      adherentCGA: checked,
      classeIGS,
      patente: igs?.patente || { montant: '', quittance: '' },
      acompteJanvier: igs?.acompteJanvier || { montant: '', quittance: '' },
      acompteFevrier: igs?.acompteFevrier || { montant: '', quittance: '' }
    };
    
    onChange("igs", updatedIGS);
  };

  const handleClasseIGSChange = (value: CGAClasse) => {
    setClasseIGS(value);
    
    // Update the parent component
    const updatedIGS: IGSData = {
      soumisIGS,
      adherentCGA,
      classeIGS: value,
      patente: igs?.patente || { montant: '', quittance: '' },
      acompteJanvier: igs?.acompteJanvier || { montant: '', quittance: '' },
      acompteFevrier: igs?.acompteFevrier || { montant: '', quittance: '' }
    };
    
    onChange("igs", updatedIGS);
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Impôt Général Synthétique (IGS)</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="soumis-igs"
              checked={soumisIGS}
              onCheckedChange={handleSoumisIGSChange}
            />
            <Label htmlFor="soumis-igs">Client soumis à l'IGS</Label>
          </div>
          
          {soumisIGS && (
            <>
              <div className="flex items-center space-x-2">
                <Switch
                  id="adherent-cga"
                  checked={adherentCGA}
                  onCheckedChange={handleAdherentCGAChange}
                />
                <Label htmlFor="adherent-cga">Adhérent au Centre de Gestion Agréé (CGA)</Label>
              </div>
              
              <IGSClassSelector 
                classeIGS={classeIGS} 
                onChange={handleClasseIGSChange} 
              />
              
              <IGSAmountDisplay 
                soumisIGS={soumisIGS} 
                classeIGS={classeIGS} 
                adherentCGA={adherentCGA} 
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
