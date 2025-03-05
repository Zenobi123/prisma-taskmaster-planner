
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

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

  // Calculate totals
  const totals = commercialActivityData.reduce(
    (acc, curr) => ({
      month: "Total",
      irPrincipal: acc.irPrincipal + curr.irPrincipal,
      irCAC: acc.irCAC + curr.irCAC,
      irTotal: acc.irTotal + curr.irTotal,
      caHT: acc.caHT + curr.caHT
    }),
    { month: "Total", irPrincipal: 0, irCAC: 0, irTotal: 0, caHT: 0 }
  );

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
                      </ul>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Tableau d'analyse</h4>
                        <div className="rounded-md border overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Mois</TableHead>
                                <TableHead>Accompte sur IR (Principal)</TableHead>
                                <TableHead>Accompte sur IR (CAC)</TableHead>
                                <TableHead>Accompte sur IR (Total)</TableHead>
                                <TableHead>CA HT</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {commercialActivityData.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell>{row.month}</TableCell>
                                  <TableCell>
                                    <Input
                                      type="text"
                                      value={row.irPrincipal ? formatNumberWithSeparator(row.irPrincipal) : ''}
                                      onChange={(e) => handleIRPrincipalChange(index, e.target.value)}
                                      className="w-32"
                                    />
                                  </TableCell>
                                  <TableCell>{formatNumberWithSeparator(row.irCAC)}</TableCell>
                                  <TableCell>{formatNumberWithSeparator(row.irTotal)}</TableCell>
                                  <TableCell>{formatNumberWithSeparator(row.caHT)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow className="font-medium bg-slate-50">
                                <TableCell>{totals.month}</TableCell>
                                <TableCell>{formatNumberWithSeparator(totals.irPrincipal)}</TableCell>
                                <TableCell>{formatNumberWithSeparator(totals.irCAC)}</TableCell>
                                <TableCell>{formatNumberWithSeparator(totals.irTotal)}</TableCell>
                                <TableCell>{formatNumberWithSeparator(totals.caHT)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
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
