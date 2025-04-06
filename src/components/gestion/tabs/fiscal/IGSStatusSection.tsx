
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CGAClasse } from "@/hooks/fiscal/types";
import { BadgeEuro } from "lucide-react";

interface IGSClasseInfo {
  tranche: string;
  montant: number;
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

interface IGSStatusSectionProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  onChange: (name: string, value: any) => void;
}

export function IGSStatusSection({
  soumisIGS = false,
  adherentCGA = false,
  classeIGS,
  onChange
}: IGSStatusSectionProps) {
  const montantIGS = React.useMemo(() => {
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

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-semibold">Impôt Général Synthétique (IGS)</h3>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
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
                
                <div className="mt-4">
                  <Label className="mb-2 block">Classe IGS</Label>
                  <RadioGroup
                    value={classeIGS || "classe1"}
                    onValueChange={(value) => onChange("igs.classeIGS", value as CGAClasse)}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
                  >
                    {Object.entries(igsClassesInfo).map(([classe, info]) => (
                      <div key={classe} className="flex items-center space-x-2">
                        <RadioGroupItem value={classe} id={`igs-${classe}`} />
                        <Label htmlFor={`igs-${classe}`} className="flex flex-col">
                          <span>Classe {classe.replace('classe', '')}</span>
                          <span className="text-xs text-gray-500">{info.tranche} FCFA</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                {montantIGS !== null && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md mt-6">
                    <p className="text-green-800 font-medium flex items-center">
                      <BadgeEuro className="h-5 w-5 mr-2" />
                      Montant de l'IGS à payer: {montantIGS.toLocaleString()} FCFA
                      {adherentCGA && " (Réduction CGA de 50% appliquée)"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
