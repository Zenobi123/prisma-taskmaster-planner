import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChiffreAffairesSection } from "./components/ChiffreAffairesSection";
import { EtablissementsSection } from "./components/EtablissementsSection";
import { IGSClassesSelector } from "./components/IGSClassesSelector";
import { IGSAmountDisplay } from "./components/IGSAmountDisplay";
import { IGSPaymentsSection } from "./components/IGSPaymentsSection";
import { CGAClasse, Etablissement } from "@/types/client";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";

interface IGSStatusSectionProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patente?: IGSPayment;
  acompteJanvier?: IGSPayment;
  acompteFevrier?: IGSPayment;
  chiffreAffairesAnnuel?: number;
  etablissements?: Etablissement[];
  onChange: (name: string, value: any) => void;
}

export function IGSStatusSection({
  soumisIGS = false,
  adherentCGA = false,
  classeIGS,
  patente = { montant: '', quittance: '' },
  acompteJanvier = { montant: '', quittance: '' },
  acompteFevrier = { montant: '', quittance: '' },
  chiffreAffairesAnnuel = 0,
  etablissements = [],
  onChange
}: IGSStatusSectionProps) {
  const [patenteState, setPatenteState] = useState<IGSPayment>(patente);
  const [acompteJanvierState, setAcompteJanvierState] = useState<IGSPayment>(acompteJanvier);
  const [acompteFevrierState, setAcompteFevrierState] = useState<IGSPayment>(acompteFevrier);
  const [classeIGSState, setClasseIGSState] = useState<CGAClasse | undefined>(classeIGS);
  const [chiffreAffairesAnnuelState, setChiffreAffairesAnnuelState] = useState<number>(chiffreAffairesAnnuel);
  const [etablissementsState, setEtablissementsState] = useState<Etablissement[]>(etablissements);

  // Initialize state with props when they change
  useEffect(() => {
    setPatenteState(patente);
    setAcompteJanvierState(acompteJanvier);
    setAcompteFevrierState(acompteFevrier);
    setClasseIGSState(classeIGS);
    setChiffreAffairesAnnuelState(chiffreAffairesAnnuel);
    setEtablissementsState(etablissements);
  }, [patente, acompteJanvier, acompteFevrier, classeIGS, chiffreAffairesAnnuel, etablissements]);

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

  const handleChiffreAffairesChange = useCallback((value: number) => {
    setChiffreAffairesAnnuelState(value);
    onChange("igs.chiffreAffairesAnnuel", value);
  }, [onChange]);

  const handleEtablissementsChange = useCallback((value: Etablissement[]) => {
    setEtablissementsState(value);
    onChange("igs.etablissements", value);
  }, [onChange]);

  const handleClasseIGSChange = useCallback((value: CGAClasse) => {
    setClasseIGSState(value);
    onChange("igs.classeIGS", value);
  }, [onChange]);

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

                {/* Chiffre d'affaires Section */}
                <ChiffreAffairesSection
                  chiffreAffaires={chiffreAffairesAnnuelState}
                  onChange={handleChiffreAffairesChange}
                  onClasseChange={handleClasseIGSChange}
                />
                
                {/* Établissements Section */}
                <EtablissementsSection
                  etablissements={etablissementsState}
                  onChange={handleEtablissementsChange}
                />
                
                {/* IGS Classes Selector */}
                <IGSClassesSelector 
                  classeIGS={classeIGSState} 
                  onChange={handleClasseIGSChange} 
                />
                
                {/* IGS Amount Display */}
                <IGSAmountDisplay 
                  soumisIGS={soumisIGS} 
                  classeIGS={classeIGSState} 
                  adherentCGA={adherentCGA} 
                />
                
                {/* IGS Payments Section */}
                <IGSPaymentsSection 
                  patente={patenteState}
                  acompteJanvier={acompteJanvierState}
                  acompteFevrier={acompteFevrierState}
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
