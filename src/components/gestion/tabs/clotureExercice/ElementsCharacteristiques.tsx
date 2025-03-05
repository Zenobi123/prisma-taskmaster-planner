
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityTypeSelector } from "./ActivityTypeSelector";
import { CommercialActivityContent } from "./CommercialActivityContent";
import { ServiceActivityContent } from "./ServiceActivityContent";

interface CommercialActivityRow {
  month: string;
  irPrincipal: number;
  irCAC: number;
  irTotal: number;
  caHT: number;
}

interface ElementsCharacteristiquesProps {
  previousYear: number;
  activityType: "commercial" | "service";
  setActivityType: (type: "commercial" | "service") => void;
  commercialActivityData: CommercialActivityRow[];
  handleIRPrincipalChange: (index: number, value: string) => void;
  formatNumberWithSeparator: (value: number) => string;
}

export const ElementsCharacteristiques = ({
  previousYear,
  activityType,
  setActivityType,
  commercialActivityData,
  handleIRPrincipalChange,
  formatNumberWithSeparator
}: ElementsCharacteristiquesProps) => {
  return (
    <Card className="border-[#A8C1AE] bg-[#F2FCE2] animate-fade-in mt-4">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-lg mb-2">Chiffre d'affaires (produits)</h3>
            
            <ActivityTypeSelector 
              activityType={activityType} 
              setActivityType={setActivityType} 
            />

            {activityType === "commercial" ? (
              <CommercialActivityContent 
                previousYear={previousYear}
                commercialActivityData={commercialActivityData}
                handleIRPrincipalChange={handleIRPrincipalChange}
                formatNumberWithSeparator={formatNumberWithSeparator}
              />
            ) : (
              <ServiceActivityContent />
            )}
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-lg mb-2">Impôts</h3>
            <p className="text-sm text-muted-foreground">
              Détail des impôts et taxes payés durant l'exercice {previousYear}.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-lg mb-2">Charges</h3>
            <p className="text-sm text-muted-foreground">
              Récapitulatif des charges d'exploitation de l'exercice {previousYear}.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
