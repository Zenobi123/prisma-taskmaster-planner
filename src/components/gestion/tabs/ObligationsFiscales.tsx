
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, ClipboardCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function ObligationsFiscales() {
  const [selectedDocument, setSelectedDocument] = useState<string | undefined>(undefined);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Obligations fiscales</CardTitle>
        <CardDescription>Suivi et respect des échéances fiscales</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="documents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText size={16} />
              Documents à renouveler
            </TabsTrigger>
            <TabsTrigger value="annuelles" className="flex items-center gap-2">
              <Calendar size={16} />
              Obligations annuelles
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Documents à renouveler</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <FileText size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Attestation de non-redevance</p>
                      <p className="text-sm text-muted-foreground">À renouveler avant le 31 janvier</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Extrait du registre de commerce</p>
                      <p className="text-sm text-muted-foreground">À renouveler tous les 5 ans</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Carte de contribuable</p>
                      <p className="text-sm text-muted-foreground">À renouveler chaque année</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="annuelles" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Documents annuels</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={selectedDocument} 
                  onValueChange={setSelectedDocument}
                  className="space-y-6"
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="patente" id="patente" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="patente" className="font-medium">Patente</Label>
                      <p className="text-sm text-muted-foreground">
                        Taxe professionnelle annuelle à payer avant le 31 mars
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="bail" id="bail" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="bail" className="font-medium">Bail</Label>
                      <p className="text-sm text-muted-foreground">
                        Renouvellement du contrat de bail avant expiration
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="taxe-fonciere" id="taxe-fonciere" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="taxe-fonciere" className="font-medium">Taxe foncière</Label>
                      <p className="text-sm text-muted-foreground">
                        Impôt sur les propriétés foncières à payer avant le 30 juin
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
