
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileSpreadsheet, ClipboardList, UserRound } from "lucide-react";

export function AdministrationFiscale() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Administration fiscale</CardTitle>
        <CardDescription>Relations avec l'administration fiscale</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section 1: Documents fiscaux */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-primary" />
            Documents fiscaux
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
              <FileText size={20} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium">Déclaration Statistique et Fiscale (DSF)</p>
                <p className="text-sm text-muted-foreground">Déclaration annuelle des résultats</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
              <FileText size={20} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium">Déclaration Mensuelle des Taxes (DMT)</p>
                <p className="text-sm text-muted-foreground">Relevé mensuel des taxes collectées</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
              <FileText size={20} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium">Attestation de Non Redevance (ANR)</p>
                <p className="text-sm text-muted-foreground">Certificat de situation fiscale</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section 2: Procédures courantes */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <ClipboardList size={20} className="text-primary" />
            Procédures courantes
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
              <FileText size={20} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium">Demande d'attestation de non redevance</p>
                <p className="text-sm text-muted-foreground">Procédure et documents requis</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
              <FileText size={20} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium">Réclamation contentieuse</p>
                <p className="text-sm text-muted-foreground">Contestation d'un redressement fiscal</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
              <FileText size={20} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium">Procédure de redressement</p>
                <p className="text-sm text-muted-foreground">Étapes et recours disponibles</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section 3: Contacts principaux */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <UserRound size={20} className="text-primary" />
            Contacts principaux
          </h3>
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
            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-md">
              <FileText size={20} className="text-primary mt-0.5" />
              <div>
                <p className="font-medium">Service de Contrôle Fiscal</p>
                <p className="text-sm text-muted-foreground">Service des grandes entreprises</p>
                <p className="text-sm text-muted-foreground">Tel: +237 222 20 40 40</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
