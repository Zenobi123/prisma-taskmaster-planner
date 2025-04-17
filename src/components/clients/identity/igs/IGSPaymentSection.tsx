
import { useState, useEffect, useMemo } from "react";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BadgeEuro, Receipt } from "lucide-react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/hooks/fiscal/types";
import { igsClassesInfo } from "./IGSClassSelector";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IGSPaymentSectionProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patente: IGSPayment;
  acompteJanvier: IGSPayment;
  acompteFevrier: IGSPayment;
  onChange: (name: string, value: any) => void;
}

export function IGSPaymentSection({
  soumisIGS,
  adherentCGA,
  classeIGS,
  patente,
  acompteJanvier,
  acompteFevrier,
  onChange
}: IGSPaymentSectionProps) {
  const [patenteState, setPatenteState] = useState<IGSPayment>(patente);
  const [acompteJanvierState, setAcompteJanvierState] = useState<IGSPayment>(acompteJanvier);
  const [acompteFevrierState, setAcompteFevrierState] = useState<IGSPayment>(acompteFevrier);
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
      const fevrierValue = parseFloat(acompteFevrierState.montant) || 0;
      
      const reliquatValue = montantIGS - patenteValue - janvierValue - fevrierValue;
      setReliquat(reliquatValue > 0 ? reliquatValue : 0);
    } else {
      setReliquat(null);
    }
  }, [montantIGS, patenteState.montant, acompteJanvierState.montant, acompteFevrierState.montant]);

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
        updatedPayment = { ...acompteFevrierState, [type]: value };
        setAcompteFevrierState(updatedPayment);
        onChange("igs.acompteFevrier", updatedPayment);
        break;
    }
  };

  if (!soumisIGS || !montantIGS) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-medium">Paiements et déductions</h4>
      
      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <Receipt className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Les paiements et déductions ne sont pris en compte que s'ils sont autorisés par l'administration fiscale.
        </AlertDescription>
      </Alert>
      
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
            value={acompteFevrierState.montant}
            onChange={(e) => handlePaymentChange('acompteFevrier', 'montant', e.target.value)}
            placeholder="Montant"
          />
        </FormItem>
        <FormItem>
          <Label>Numéro de quittance</Label>
          <Input 
            value={acompteFevrierState.quittance}
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
  );
}
