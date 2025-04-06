
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CGAClasse } from "@/types/client";
import { useState, useEffect } from "react";

interface IGSFieldsProps {
  soumisIGS?: boolean;
  adherentCGA?: boolean;
  classeIGS?: CGAClasse;
  onChange: (name: string, value: any) => void;
}

export function IGSFields({ 
  soumisIGS = false, 
  adherentCGA = false, 
  classeIGS, 
  onChange 
}: IGSFieldsProps) {
  const [montantIGS, setMontantIGS] = useState<number | null>(null);

  // Calculer le montant IGS en fonction de la classe
  useEffect(() => {
    if (soumisIGS && classeIGS) {
      let baseAmount = 0;
      
      switch(classeIGS) {
        case "classe1":
          baseAmount = 50000;
          break;
        case "classe2":
          baseAmount = 100000;
          break;
        case "classe3":
          baseAmount = 200000;
          break;
        case "classe4":
          baseAmount = 500000;
          break;
        default:
          baseAmount = 0;
      }
      
      // Appliquer une réduction de 10% si adhérent CGA
      if (adherentCGA) {
        baseAmount = baseAmount * 0.9;
      }
      
      setMontantIGS(baseAmount);
    } else {
      setMontantIGS(null);
    }
  }, [soumisIGS, classeIGS, adherentCGA]);

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
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="classe1" id="classe1" />
                <Label htmlFor="classe1">Classe 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="classe2" id="classe2" />
                <Label htmlFor="classe2">Classe 2</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="classe3" id="classe3" />
                <Label htmlFor="classe3">Classe 3</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="classe4" id="classe4" />
                <Label htmlFor="classe4">Classe 4</Label>
              </div>
            </RadioGroup>
          </div>

          {montantIGS !== null && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium">
                Montant IGS à payer: {montantIGS.toLocaleString()} FCFA
                {adherentCGA && " (Réduction CGA de 10% appliquée)"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
