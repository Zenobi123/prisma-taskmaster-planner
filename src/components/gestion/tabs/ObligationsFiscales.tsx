
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, CheckCircle, ClipboardCheck, Clock } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format, addMonths } from "date-fns";

export function ObligationsFiscales() {
  const [creationDate, setCreationDate] = useState<string>("");
  const [validityEndDate, setValidityEndDate] = useState<string>("");

  // Calculate end validity date (3 months after creation date)
  useEffect(() => {
    if (creationDate) {
      try {
        const [day, month, year] = creationDate.split('/').map(part => parseInt(part));
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          // Create date from DD/MM/YY format
          const fullYear = year < 100 ? 2000 + year : year;
          const date = new Date(fullYear, month - 1, day);
          
          // Add 3 months
          const endDate = addMonths(date, 3);
          
          // Format end date as DD/MM/YY
          setValidityEndDate(format(endDate, 'dd/MM/yy'));
        }
      } catch (error) {
        console.error("Error calculating validity end date:", error);
      }
    }
  }, [creationDate]);

  // Handle date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and slashes
    if (/^[0-9/]*$/.test(value)) {
      setCreationDate(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Obligations fiscales</CardTitle>
        <CardDescription>Suivi et respect des échéances fiscales</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="attestation" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attestation" className="flex items-center gap-2">
              <CheckCircle size={16} />
              Attestation de Conformité Fiscale
            </TabsTrigger>
            <TabsTrigger value="annuelles" className="flex items-center gap-2">
              <Calendar size={16} />
              Obligations annuelles
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="attestation" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Attestation de Conformité Fiscale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Attestation de Conformité Fiscale</p>
                      <p className="text-sm text-muted-foreground">
                        Ce document atteste que l'entreprise est en conformité avec ses obligations fiscales
                      </p>
                    </div>
                  </div>
                  
                  <div className="pl-7 pt-2">
                    <div className="border p-4 rounded-md">
                      <p className="font-medium mb-2">État de l'attestation</p>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={16} />
                        <span>À jour</span>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="creationDate" className="text-sm">Date de création (DD/MM/YY)</Label>
                          <Input 
                            id="creationDate" 
                            value={creationDate} 
                            onChange={handleDateChange} 
                            placeholder="JJ/MM/AA"
                            className="max-w-xs"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="validityEndDate" className="text-sm">Date de fin de validité</Label>
                          <Input 
                            id="validityEndDate" 
                            value={validityEndDate} 
                            readOnly 
                            disabled
                            className="max-w-xs bg-gray-50"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Validité de 03 mois à partir de la date de création
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="annuelles" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Obligations annuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="patente" className="space-y-6">
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="patente" id="patente" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="patente" className="font-medium">Patente</Label>
                      <p className="text-sm text-muted-foreground">
                        Impôt annuel payé par les entreprises pour exercer une activité commerciale ou industrielle
                      </p>
                      <div className="flex items-center gap-2 text-amber-600 mt-1">
                        <Clock size={14} />
                        <span className="text-xs">Date limite de paiement: 28 février</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="bail" id="bail" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="bail" className="font-medium">Bail</Label>
                      <p className="text-sm text-muted-foreground">
                        Contrat de location des locaux professionnels à renouveler selon les termes prévus
                      </p>
                      <div className="flex items-center gap-2 text-amber-600 mt-1">
                        <Clock size={14} />
                        <span className="text-xs">Date limite de paiement: 28 février</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="taxe-fonciere" id="taxe-fonciere" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="taxe-fonciere" className="font-medium">Taxe foncière</Label>
                      <p className="text-sm text-muted-foreground">
                        Impôt local annuel sur les propriétés bâties et non bâties
                      </p>
                      <div className="flex items-center gap-2 text-amber-600 mt-1">
                        <Clock size={14} />
                        <span className="text-xs">Date limite de paiement: 28 février</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="dsf" id="dsf" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="dsf" className="font-medium">Déclaration Statistique et Fiscale (DSF)</Label>
                      <p className="text-sm text-muted-foreground">
                        Document fiscal regroupant les données comptables et fiscales annuelles de l'entreprise
                      </p>
                      <div className="flex items-center gap-2 text-amber-600 mt-1">
                        <Clock size={14} />
                        <span className="text-xs">Date limite de dépôt: 15 avril</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="darp" id="darp" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="darp" className="font-medium">Déclaration Annuelle des Revenus des Particuliers (DARP)</Label>
                      <p className="text-sm text-muted-foreground">
                        Déclaration annuelle des revenus pour les personnes physiques
                      </p>
                      <div className="flex items-center gap-2 text-amber-600 mt-1">
                        <Clock size={14} />
                        <span className="text-xs">Date limite de dépôt: 30 juin</span>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
