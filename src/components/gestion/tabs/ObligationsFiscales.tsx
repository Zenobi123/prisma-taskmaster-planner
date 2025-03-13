
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText } from "lucide-react";

export function ObligationsFiscales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Obligations fiscales</CardTitle>
        <CardDescription>Suivi et respect des échéances fiscales</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mensuelles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="mensuelles" className="flex items-center gap-2">
              <Clock size={16} />
              Obligations mensuelles
            </TabsTrigger>
            <TabsTrigger value="annuelles" className="flex items-center gap-2">
              <Calendar size={16} />
              Obligations annuelles
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mensuelles" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Déclarations mensuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <FileText size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Déclaration de TVA</p>
                      <p className="text-sm text-muted-foreground">À déposer avant le 15 du mois</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Acomptes d'impôt sur le revenu</p>
                      <p className="text-sm text-muted-foreground">À payer avant le 20 du mois</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Déclaration de retenue à la source</p>
                      <p className="text-sm text-muted-foreground">À déposer avant le dernier jour du mois</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="annuelles" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Déclarations annuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <FileText size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Déclaration statistique et fiscale (DSF)</p>
                      <p className="text-sm text-muted-foreground">À déposer avant le 30 mars de chaque année</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Déclaration annuelle des salaires (DAS)</p>
                      <p className="text-sm text-muted-foreground">À déposer avant le 1er mars de chaque année</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Solde d'impôt sur les sociétés (IS)</p>
                      <p className="text-sm text-muted-foreground">À payer avant le 15 avril de chaque année</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Déclaration définitive TVA</p>
                      <p className="text-sm text-muted-foreground">À déposer avant le 30 avril de chaque année</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
