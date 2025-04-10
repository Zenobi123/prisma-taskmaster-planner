
import { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CGAClasse } from "@/hooks/fiscal/types";
import { FormItem, FormLabel } from "@/components/ui/form";
import { BadgeEuro } from "lucide-react";
import { Input } from "@/components/ui/input";

// Interface pour la structure de données des classes IGS avec leurs tranches et montants
interface IGSClasseInfo {
  tranche: string;
  montant: number;
}

interface IGSPayment {
  montant: string;
  quittance: string;
}

// Tableau des informations pour chaque classe IGS avec les montants corrigés
const igsClassesInfo: Record<string, IGSClasseInfo> = {
  "classe1": { tranche: "Moins de 500 000", montant: 20000 },
  "classe2": { tranche: "500 000 à 1 000 000", montant: 30000 },
  "classe3": { tranche: "1 000 000 à 1 500 000", montant: 40000 },
  "classe4": { tranche: "1 500 000 à 2 000 000", montant: 50000 },
  "classe5": { tranche: "2 000 000 à 2 500 000", montant: 60000 },
  "classe6": { tranche: "2 500 000 à 4 999 999", montant: 150000 },
  "classe7": { tranche: "5 000 000 à 9 999 999", montant: 300000 },
  "classe8": { tranche: "10 000 000 à 19 999 999", montant: 500000 },
  "classe9": { tranche: "20 000 000 à 29 999 999", montant: 1000000 },
  "classe10": { tranche: "30 000 000 à 49 999 999", montant: 2000000 },
};

interface IGSFieldsProps {
  soumisIGS?: boolean;
  adherentCGA?: boolean;
  classeIGS?: CGAClasse;
  patente?: IGSPayment;
  acompteJanvier?: IGSPayment;
  acompteFevrier?: IGSPayment;
  onChange: (name: string, value: any) => void;
}

export function IGSFields({ 
  soumisIGS = false, 
  adherentCGA = false, 
  classeIGS,
  patente = { montant: '', quittance: '' },
  acompteJanvier = { montant: '', quittance: '' },
  acompteFevrier = { montant: '', quittance: '' },
  onChange 
}: IGSFieldsProps) {
  const [patenteState, setPatenteState] = useState<IGSPayment>(patente);
  const [acompteJanvierState, setAcompteJanvierState] = useState<IGSPayment>(acompteJanvier);
  const [acompteFevierState, setAcompteFevrierState] = useState<IGSPayment>(acompteFevrier);
  const [reliquat, setReliquat] = useState<number | null>(null);

  // Initialiser les états avec les props quand elles changent
  useEffect(() => {
    setPatenteState(patente);
    setAcompteJanvierState(acompteJanvier);
    setAcompteFevrierState(acompteFevrier);
  }, [patente, acompteJanvier, acompteFevrier]);

  // Calculer le montant IGS en fonction de la classe
  const montantIGS = useMemo(() => {
    if (soumisIGS && classeIGS && igsClassesInfo[classeIGS]) {
      let baseAmount = igsClassesInfo[classeIGS].montant;
      
      // Appliquer une réduction de 50% si adhérent CGA
      if (adherentCGA) {
        baseAmount = baseAmount * 0.5;
      }
      
      return baseAmount;
    }
    return null;
  }, [soumisIGS, classeIGS, adherentCGA]);

  // Calculer le reliquat IGS
  useEffect(() => {
    if (montantIGS !== null) {
      const patenteValue = parseFloat(patenteState.montant) || 0;
      const janvierValue = parseFloat(acompteJanvierState.montant) || 0;
      const fevrierValue = parseFloat(acompteFevierState.montant) || 0;
      
      const reliquatValue = montantIGS - patenteValue - janvierValue - fevrierValue;
      setReliquat(reliquatValue > 0 ? reliquatValue : 0);
    } else {
      setReliquat(null);
    }
  }, [montantIGS, patenteState.montant, acompteJanvierState.montant, acompteFevierState.montant]);

  // Gérer les changements de valeurs pour les paiements
  const handlePaymentChange = (
    field: 'patente' | 'acompteJanvier' | 'acompteFevrier',
    type: 'montant' | 'quittance',
    value: string
  ) => {
    let updatedPayment: IGSPayment;
    
    switch (field) {
      case 'patente':
        updatedPayment = { ...patenteState, [type]: value };
        setPatenteState(updatedPayment);
        onChange("igs.patente", updatedPayment);
        break;
      case 'acompteJanvier':
        updatedPayment = { ...acompteJanvierState, [type]: value };
        setAcompteJanvierState(updatedPayment);
        onChange("igs.acompteJanvier", updatedPayment);
        break;
      case 'acompteFevrier':
        updatedPayment = { ...acompteFevierState, [type]: value };
        setAcompteFevrierState(updatedPayment);
        onChange("igs.acompteFevrier", updatedPayment);
        break;
    }
  };

  return (
    <div className="space-y-4 mt-6 border-t pt-4">
      <div>
        <Label className="mb-2 block font-medium">Soumis à l'Impôt Général Synthétique (IGS)</Label>
        <RadioGroup
          value={soumisIGS ? "true" : "false"}
          onValueChange={(value) => onChange("igs.soumisIGS", value === "true")}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="soumis_igs_oui" />
            <Label htmlFor="soumis_igs_oui">Oui</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="soumis_igs_non" />
            <Label htmlFor="soumis_igs_non">Non</Label>
          </div>
        </RadioGroup>
      </div>

      {soumisIGS && (
        <>
          <div>
            <Label className="mb-2 block">Adhérent Centre de Gestion Agréé (CGA)</Label>
            <RadioGroup
              value={adherentCGA ? "true" : "false"}
              onValueChange={(value) => onChange("igs.adherentCGA", value === "true")}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="adherent_cga_oui" />
                <Label htmlFor="adherent_cga_oui">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="adherent_cga_non" />
                <Label htmlFor="adherent_cga_non">Non</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-2 block">Classe IGS</Label>
            <RadioGroup
              value={classeIGS || "classe1"}
              onValueChange={(value) => onChange("igs.classeIGS", value as CGAClasse)}
              className="grid grid-cols-2 gap-4"
            >
              {Object.entries(igsClassesInfo).map(([classe, info]) => (
                <div key={classe} className="flex items-center space-x-2">
                  <RadioGroupItem value={classe} id={classe} />
                  <Label htmlFor={classe} className="flex flex-col">
                    <span>Classe {classe.replace('classe', '')}</span>
                    <span className="text-xs text-gray-500">{info.tranche} FCFA</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {montantIGS !== null && (
            <>
              <div className="p-4 bg-green-50 border border-green-200 rounded-md mt-6">
                <p className="text-green-800 font-medium flex items-center">
                  <BadgeEuro className="h-5 w-5 mr-2" />
                  Montant de l'IGS à payer: {montantIGS.toLocaleString()} FCFA
                  {adherentCGA && " (Réduction CGA de 50% appliquée)"}
                </p>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Paiements et déductions</h4>
                
                {/* Patente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem>
                    <Label>Patente payée pour l'exercice (FCFA)</Label>
                    <Input 
                      type="number" 
                      value={patenteState.montant}
                      onChange={(e) => handlePaymentChange('patente', 'montant', e.target.value)}
                      placeholder="Montant"
                    />
                  </FormItem>
                  <FormItem>
                    <Label>Numéro de quittance</Label>
                    <Input 
                      value={patenteState.quittance}
                      onChange={(e) => handlePaymentChange('patente', 'quittance', e.target.value)}
                      placeholder="Numéro de quittance"
                    />
                  </FormItem>
                </div>
                
                {/* Acompte IR de janvier */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem>
                    <Label>Acompte IR de janvier 2025 (FCFA)</Label>
                    <Input 
                      type="number" 
                      value={acompteJanvierState.montant}
                      onChange={(e) => handlePaymentChange('acompteJanvier', 'montant', e.target.value)}
                      placeholder="Montant"
                    />
                  </FormItem>
                  <FormItem>
                    <Label>Numéro de quittance</Label>
                    <Input 
                      value={acompteJanvierState.quittance}
                      onChange={(e) => handlePaymentChange('acompteJanvier', 'quittance', e.target.value)}
                      placeholder="Numéro de quittance"
                    />
                  </FormItem>
                </div>
                
                {/* Acompte IR de février */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem>
                    <Label>Acompte IR de février 2025 (FCFA)</Label>
                    <Input 
                      type="number" 
                      value={acompteFevierState.montant}
                      onChange={(e) => handlePaymentChange('acompteFevrier', 'montant', e.target.value)}
                      placeholder="Montant"
                    />
                  </FormItem>
                  <FormItem>
                    <Label>Numéro de quittance</Label>
                    <Input 
                      value={acompteFevierState.quittance}
                      onChange={(e) => handlePaymentChange('acompteFevrier', 'quittance', e.target.value)}
                      placeholder="Numéro de quittance"
                    />
                  </FormItem>
                </div>
                
                {/* Reliquat */}
                {reliquat !== null && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-blue-800 font-medium flex items-center">
                      <BadgeEuro className="h-5 w-5 mr-2" />
                      Reliquat IGS à payer: {reliquat.toLocaleString()} FCFA
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
