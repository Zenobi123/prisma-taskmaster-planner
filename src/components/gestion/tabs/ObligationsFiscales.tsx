
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, CheckCircle, ClipboardCheck, Clock, X, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format, addMonths } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ObligationsFiscales() {
  const [creationDate, setCreationDate] = useState<string>("");
  const [validityEndDate, setValidityEndDate] = useState<string>("");
  
  // Status states for annual obligations
  const [obligationStatuses, setObligationStatuses] = useState({
    patente: { assujetti: true, paye: false },
    bail: { assujetti: true, paye: false },
    taxeFonciere: { assujetti: true, paye: false },
    dsf: { assujetti: true, depose: false },
    darp: { assujetti: true, depose: false },
  });

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

  // Handle obligation status changes
  const handleStatusChange = (
    obligationType: keyof typeof obligationStatuses, 
    statusType: "assujetti" | "paye" | "depose", 
    value: boolean
  ) => {
    setObligationStatuses(prev => ({
      ...prev,
      [obligationType]: {
        ...prev[obligationType],
        [statusType]: value
      }
    }));
  };

  // Get status display for an obligation
  const getStatusDisplay = (
    obligationType: keyof typeof obligationStatuses,
    isDeclaration: boolean = false
  ) => {
    const { assujetti } = obligationStatuses[obligationType];
    const payeOrDepose = isDeclaration 
      ? obligationStatuses[obligationType].depose
      : obligationStatuses[obligationType].paye;
    
    if (!assujetti) {
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <X size={14} />
          <span className="text-xs">Non assujetti</span>
        </div>
      );
    }
    
    if (payeOrDepose) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle size={14} />
          <span className="text-xs">{isDeclaration ? "Déposée" : "Payé"}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1 text-red-500">
        <AlertCircle size={14} />
        <span className="text-xs">{isDeclaration ? "Non déposée" : "Non payé"}</span>
      </div>
    );
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
                <div className="space-y-6">
                  {/* Patente */}
                  <div className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="grid gap-1.5">
                        <h3 className="font-medium">Patente</h3>
                        <p className="text-sm text-muted-foreground">
                          Impôt annuel payé par les entreprises pour exercer une activité commerciale ou industrielle
                        </p>
                        <div className="flex items-center gap-2 text-amber-600 mt-1">
                          <Clock size={14} />
                          <span className="text-xs">Date limite de paiement: 28 février</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {getStatusDisplay('patente')}

                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="patente-assujetti" className="text-xs">Assujetti</Label>
                            <Switch 
                              id="patente-assujetti"
                              checked={obligationStatuses.patente.assujetti} 
                              onCheckedChange={(value) => handleStatusChange('patente', 'assujetti', value)}
                            />
                          </div>
                          
                          {obligationStatuses.patente.assujetti && (
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="patente-paye" className="text-xs">Payé</Label>
                              <Switch 
                                id="patente-paye"
                                checked={obligationStatuses.patente.paye} 
                                onCheckedChange={(value) => handleStatusChange('patente', 'paye', value)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bail */}
                  <div className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="grid gap-1.5">
                        <h3 className="font-medium">Bail</h3>
                        <p className="text-sm text-muted-foreground">
                          Contrat de location des locaux professionnels à renouveler selon les termes prévus
                        </p>
                        <div className="flex items-center gap-2 text-amber-600 mt-1">
                          <Clock size={14} />
                          <span className="text-xs">Date limite de paiement: 28 février</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {getStatusDisplay('bail')}

                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="bail-assujetti" className="text-xs">Assujetti</Label>
                            <Switch 
                              id="bail-assujetti"
                              checked={obligationStatuses.bail.assujetti} 
                              onCheckedChange={(value) => handleStatusChange('bail', 'assujetti', value)}
                            />
                          </div>
                          
                          {obligationStatuses.bail.assujetti && (
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="bail-paye" className="text-xs">Payé</Label>
                              <Switch 
                                id="bail-paye"
                                checked={obligationStatuses.bail.paye} 
                                onCheckedChange={(value) => handleStatusChange('bail', 'paye', value)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Taxe foncière */}
                  <div className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="grid gap-1.5">
                        <h3 className="font-medium">Taxe foncière</h3>
                        <p className="text-sm text-muted-foreground">
                          Impôt local annuel sur les propriétés bâties et non bâties
                        </p>
                        <div className="flex items-center gap-2 text-amber-600 mt-1">
                          <Clock size={14} />
                          <span className="text-xs">Date limite de paiement: 28 février</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {getStatusDisplay('taxeFonciere')}

                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="taxe-assujetti" className="text-xs">Assujetti</Label>
                            <Switch 
                              id="taxe-assujetti"
                              checked={obligationStatuses.taxeFonciere.assujetti} 
                              onCheckedChange={(value) => handleStatusChange('taxeFonciere', 'assujetti', value)}
                            />
                          </div>
                          
                          {obligationStatuses.taxeFonciere.assujetti && (
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="taxe-paye" className="text-xs">Payé</Label>
                              <Switch 
                                id="taxe-paye"
                                checked={obligationStatuses.taxeFonciere.paye} 
                                onCheckedChange={(value) => handleStatusChange('taxeFonciere', 'paye', value)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DSF */}
                  <div className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="grid gap-1.5">
                        <h3 className="font-medium">Déclaration Statistique et Fiscale (DSF)</h3>
                        <p className="text-sm text-muted-foreground">
                          Document fiscal regroupant les données comptables et fiscales annuelles de l'entreprise
                        </p>
                        <div className="flex items-center gap-2 text-amber-600 mt-1">
                          <Clock size={14} />
                          <span className="text-xs">Date limite de dépôt: 15 avril</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {getStatusDisplay('dsf', true)}

                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="dsf-assujetti" className="text-xs">Assujetti</Label>
                            <Switch 
                              id="dsf-assujetti"
                              checked={obligationStatuses.dsf.assujetti} 
                              onCheckedChange={(value) => handleStatusChange('dsf', 'assujetti', value)}
                            />
                          </div>
                          
                          {obligationStatuses.dsf.assujetti && (
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="dsf-depose" className="text-xs">Déposée</Label>
                              <Switch 
                                id="dsf-depose"
                                checked={obligationStatuses.dsf.depose} 
                                onCheckedChange={(value) => handleStatusChange('dsf', 'depose', value)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DARP */}
                  <div className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="grid gap-1.5">
                        <h3 className="font-medium">Déclaration Annuelle des Revenus des Particuliers (DARP)</h3>
                        <p className="text-sm text-muted-foreground">
                          Déclaration annuelle des revenus pour les personnes physiques
                        </p>
                        <div className="flex items-center gap-2 text-amber-600 mt-1">
                          <Clock size={14} />
                          <span className="text-xs">Date limite de dépôt: 30 juin</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {getStatusDisplay('darp', true)}

                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="darp-assujetti" className="text-xs">Assujetti</Label>
                            <Switch 
                              id="darp-assujetti"
                              checked={obligationStatuses.darp.assujetti} 
                              onCheckedChange={(value) => handleStatusChange('darp', 'assujetti', value)}
                            />
                          </div>
                          
                          {obligationStatuses.darp.assujetti && (
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="darp-depose" className="text-xs">Déposée</Label>
                              <Switch 
                                id="darp-depose"
                                checked={obligationStatuses.darp.depose} 
                                onCheckedChange={(value) => handleStatusChange('darp', 'depose', value)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
