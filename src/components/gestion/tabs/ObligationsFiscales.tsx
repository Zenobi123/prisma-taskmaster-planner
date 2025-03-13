
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText, CheckCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function ObligationsFiscales() {
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
                      <p className="text-sm text-muted-foreground mt-2">
                        Dernière vérification: 15/04/2024
                      </p>
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
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="bail" id="bail" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="bail" className="font-medium">Bail</Label>
                      <p className="text-sm text-muted-foreground">
                        Contrat de location des locaux professionnels à renouveler selon les termes prévus
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="taxe-fonciere" id="taxe-fonciere" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="taxe-fonciere" className="font-medium">Taxe foncière</Label>
                      <p className="text-sm text-muted-foreground">
                        Impôt local annuel sur les propriétés bâties et non bâties
                      </p>
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
