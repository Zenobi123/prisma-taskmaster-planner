
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ElementsCharacteristiques } from "./clotureExercice/ElementsCharacteristiques";
import { MontageDSF } from "./clotureExercice/MontageDSF";

interface ClotureExerciceProps {
  selectedSubTab: string | null;
  handleSubTabSelect: (subTab: string) => void;
}

interface CommercialActivityRow {
  month: string;
  irPrincipal: number;
  irCAC: number;
  irTotal: number;
  caHT: number;
}

export function ClotureExercice({ selectedSubTab, handleSubTabSelect }: ClotureExerciceProps) {
  // Calculate previous year for the exercise to be closed
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  // State for tracking activity type in the Chiffre d'affaires section
  const [activityType, setActivityType] = useState<"commercial" | "service">("commercial");
  
  // State for commercial activity data
  const [commercialActivityData, setCommercialActivityData] = useState<CommercialActivityRow[]>([]);

  // Initialize data with all months
  useEffect(() => {
    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    
    const initialData = months.map(month => ({
      month,
      irPrincipal: 0,
      irCAC: 0,
      irTotal: 0,
      caHT: 0
    }));
    
    setCommercialActivityData(initialData);
  }, []);

  // Format input value with thousands separator
  const formatNumberWithSeparator = (value: number): string => {
    return value.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  };

  // Parse input value from formatted string
  const parseFormattedNumber = (value: string): number => {
    // Remove all non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d]/g, '');
    return cleanValue ? parseInt(cleanValue, 10) : 0;
  };

  // Handle IR Principal input change with formatting
  const handleIRPrincipalChange = (index: number, value: string) => {
    const irPrincipal = parseFormattedNumber(value);
    const irCAC = irPrincipal * 0.1; // 10% of IR Principal
    const irTotal = irPrincipal + irCAC;
    const caHT = irTotal / 0.055; // CA HT = IR Total / 5.5%

    const updatedData = [...commercialActivityData];
    updatedData[index] = {
      ...updatedData[index],
      irPrincipal,
      irCAC,
      irTotal,
      caHT
    };

    setCommercialActivityData(updatedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clôture d'exercice {previousYear}</CardTitle>
        <CardDescription>Préparation et traitement de la clôture fiscale annuelle de l'exercice {previousYear}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="border-[#A8C1AE] hover:shadow-md transition-all duration-300 hover-lift cursor-pointer"
            onClick={() => handleSubTabSelect("elements-caracteristiques")}
          >
            <CardHeader>
              <CardTitle className="text-lg">Eléments caractéristiques</CardTitle>
              <CardDescription>Éléments essentiels pour la clôture annuelle {previousYear}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analyse des éléments caractéristiques et préparation des documents pour la clôture fiscale.
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="border-[#A8C1AE] hover:shadow-md transition-all duration-300 hover-lift cursor-pointer" 
            onClick={() => handleSubTabSelect("montage-dsf")}
          >
            <CardHeader>
              <CardTitle className="text-lg">Montage DSF</CardTitle>
              <CardDescription>Déclaration statistique et fiscale {previousYear}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Préparation et montage des documents pour la déclaration statistique et fiscale (DSF) de l'exercice {previousYear}.
              </p>
            </CardContent>
          </Card>
        </div>

        {selectedSubTab === "elements-caracteristiques" && (
          <ElementsCharacteristiques 
            previousYear={previousYear}
            activityType={activityType}
            setActivityType={setActivityType}
            commercialActivityData={commercialActivityData}
            handleIRPrincipalChange={handleIRPrincipalChange}
            formatNumberWithSeparator={formatNumberWithSeparator}
          />
        )}

        {selectedSubTab === "montage-dsf" && (
          <MontageDSF previousYear={previousYear} />
        )}
      </CardContent>
    </Card>
  );
}
