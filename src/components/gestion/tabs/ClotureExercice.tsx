
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ClotureExerciceProps {
  selectedSubTab: string | null;
  handleSubTabSelect: (subTab: string) => void;
}

export function ClotureExercice({ selectedSubTab, handleSubTabSelect }: ClotureExerciceProps) {
  // Calculate previous year for the exercise to be closed
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  // State for tracking activity type in the Chiffre d'affaires section
  const [activityType, setActivityType] = useState<"commercial" | "service">("commercial");

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
          <Card className="border-[#A8C1AE] bg-[#F2FCE2] animate-fade-in mt-4">
            <CardHeader>
              <CardTitle className="text-[#1A1F2C]">Eléments caractéristiques {previousYear}</CardTitle>
              <CardDescription className="text-[#8E9196]">
                Éléments essentiels pour la clôture annuelle de l'exercice {previousYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="font-medium text-lg mb-2">Chiffre d'affaires (produits)</h3>
                  
                  <RadioGroup 
                    value={activityType} 
                    onValueChange={(value) => setActivityType(value as "commercial" | "service")} 
                    className="mt-2 mb-4"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="commercial" id="commercial" />
                        <Label htmlFor="commercial">Activité commerciale</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="service" id="service" />
                        <Label htmlFor="service">Prestataire de services</Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {activityType === "commercial" ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Analyse du chiffre d'affaires pour l'activité commerciale de l'exercice {previousYear}.
                      </p>
                      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                        <li>Ventes de marchandises</li>
                        <li>Marges brutes</li>
                        <li>Rotation des stocks</li>
                        <li>Analyse par gamme de produits</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Analyse du chiffre d'affaires pour l'activité de prestation de services de l'exercice {previousYear}.
                      </p>
                      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                        <li>Prestations facturées</li>
                        <li>Répartition par type de prestation</li>
                      </ul>
                    </div>
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
        )}

        {selectedSubTab === "montage-dsf" && (
          <Card className="border-[#A8C1AE] bg-[#F2FCE2] animate-fade-in mt-4">
            <CardHeader>
              <CardTitle className="text-[#1A1F2C]">Montage DSF {previousYear}</CardTitle>
              <CardDescription className="text-[#8E9196]">
                Déclaration statistique et fiscale de l'exercice {previousYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Détails sur la préparation et le montage des documents pour la déclaration statistique et fiscale (DSF) de l'exercice {previousYear}.
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
