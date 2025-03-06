
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function AdministrationFiscale() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Administration fiscale</CardTitle>
        <CardDescription>Relations avec l'administration fiscale</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Contacts principaux</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
              <FileText size={20} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium">Direction Générale des Impôts</p>
                <p className="text-sm text-muted-foreground">Yaoundé - Quartier Administratif</p>
                <p className="text-sm text-muted-foreground">Tel: +237 222 23 11 11</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
              <FileText size={20} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium">Centre des Impôts de Rattachement</p>
                <p className="text-sm text-muted-foreground">CIME Yaoundé I</p>
                <p className="text-sm text-muted-foreground">Tel: +237 222 20 55 55</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Procédures courantes</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">Demande d'attestation de non redevance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">Réclamation contentieuse</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">Demande de remise gracieuse</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-sm">Procédure de redressement</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
