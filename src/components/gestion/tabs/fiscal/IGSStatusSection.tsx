
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CGAClasse } from "@/hooks/fiscal/types";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { IGSClassesSelector } from "./components/IGSClassesSelector";
import { IGSAmountDisplay } from "./components/IGSAmountDisplay";
import { IGSPaymentsSection, calculateIGSAmount } from "./components/IGSPaymentsSection";

interface IGSStatusSectionProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patente?: IGSPayment;
  acompteJanvier?: IGSPayment;
  acompteFevrier?: IGSPayment;
  onChange: (name: string, value: any) => void;
}

export function IGSStatusSection({
  soumisIGS = false,
  adherentCGA = false,
  classeIGS,
  patente = { montant: '', quittance: '' },
  acompteJanvier = { montant: '', quittance: '' },
  acompteFevrier = { montant: '', quittance: '' },
  onChange
}: IGSStatusSectionProps) {
  const [patenteState, setPatenteState] = useState<IGSPayment>(patente);
  const [acompteJanvierState, setAcompteJanvierState] = useState<IGSPayment>(acompteJanvier);
  const [acompteFevierState, setAcompteFevrierState] = useState<IGSPayment>(acompteFevrier);

  // Initialize state with props when they change
  useEffect(() => {
    setPatenteState(patente);
    setAcompteJanvierState(acompteJanvier);
    setAcompteFevrierState(acompteFevrier);
  }, [patente, acompteJanvier, acompteFevrier]);

  // Calculate the IGS amount based on class and CGA status
  const montantIGS = calculateIGSAmount(soumisIGS, classeIGS, adherentCGA);

  // Handler functions for payment updates
  const handlePatenteChange = (payment: IGSPayment) => {
    setPatenteState(payment);
    onChange("igs.patente", payment);
  };

  const handleAcompteJanvierChange = (payment: IGSPayment) => {
    setAcompteJanvierState(payment);
    onChange("igs.acompteJanvier", payment);
  };

  const handleAcompteFevierChange = (payment: IGSPayment) => {
    setAcompteFevrierState(payment);
    onChange("igs.acompteFevrier", payment);
  };

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-semibold">Impôt Général Synthétique (IGS)</h3>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            {/* IGS Status Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="soumis-igs"
                checked={soumisIGS}
                onCheckedChange={(checked) => onChange("igs.soumisIGS", checked)}
              />
              <Label htmlFor="soumis-igs">
                {soumisIGS ? "Soumis à l'IGS" : "Non soumis à l'IGS"}
              </Label>
            </div>
            
            {soumisIGS && (
              <>
                {/* CGA Status Toggle */}
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    id="adherent-cga"
                    checked={adherentCGA}
                    onCheckedChange={(checked) => onChange("igs.adherentCGA", checked)}
                  />
                  <Label htmlFor="adherent-cga">
                    {adherentCGA ? "Adhérent CGA" : "Non adhérent CGA"}
                  </Label>
                </div>
                
                {/* IGS Classes Selector */}
                <IGSClassesSelector 
                  classeIGS={classeIGS} 
                  onChange={(value) => onChange("igs.classeIGS", value)} 
                />
                
                {/* IGS Amount Display */}
                <IGSAmountDisplay 
                  soumisIGS={soumisIGS} 
                  classeIGS={classeIGS} 
                  adherentCGA={adherentCGA} 
                />
                
                {/* IGS Payments Section */}
                <IGSPaymentsSection 
                  montantIGS={montantIGS}
                  patente={patenteState}
                  acompteJanvier={acompteJanvierState}
                  acompteFevrier={acompteFevierState}
                  onPatenteChange={handlePatenteChange}
                  onAcompteJanvierChange={handleAcompteJanvierChange}
                  onAcompteFevierChange={handleAcompteFevierChange}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
