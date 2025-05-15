
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxObligationItem } from "./TaxObligationItem";
import { DeclarationObligationItem } from "./DeclarationObligationItem";
import { ObligationStatuses, TaxObligationStatus, DeclarationObligationStatus } from "@/hooks/fiscal/types";

interface AnnualObligationsSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  onAttachmentChange: (obligation: string, isDeclaration: boolean, attachmentType: string, filePath: string) => void;
  clientId: string;
  selectedYear: string;
}

export const AnnualObligationsSection: React.FC<AnnualObligationsSectionProps> = ({
  obligationStatuses,
  handleStatusChange,
  onAttachmentChange,
  clientId,
  selectedYear
}) => {
  // Adapter for status change - convert parameter types
  const handleStatusChangeAdapter = (key: string, field: string, value: any) => {
    handleStatusChange(key, field, value);
  };

  // Adapter for attachment - convert parameter types
  const handleAttachmentChangeAdapter = (key: string, isDeclaration: boolean, attachmentType: string, filePath: string) => {
    onAttachmentChange(key, isDeclaration, attachmentType, filePath);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Obligations fiscales {selectedYear}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Taxes et impôts</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <TaxObligationItem
              title="IGS (Impôt Général Synthétique)"
              keyName="igs"
              status={obligationStatuses.igs}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
              showIGSPanel={true}
            />
            
            <TaxObligationItem
              title="Patente"
              keyName="patente"
              status={obligationStatuses.patente}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="BAIC (Impôts sur les Bénéfices Artisanaux, Industriels et Commerciaux)"
              keyName="baic"
              status={obligationStatuses.baic}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="IBA (Impôts sur les Bénéfices Agricoles)"
              keyName="iba"
              status={obligationStatuses.iba}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="IBNC (Impôts sur les Bénéfices des Professions Non Commerciales)"
              keyName="ibnc"
              status={obligationStatuses.ibnc}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="IRCM (Impôts sur les Revenus des Capitaux Mobiliers)"
              keyName="ircm"
              status={obligationStatuses.ircm}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="IRF (Impôts sur les Revenus Fonciers)"
              keyName="irf"
              status={obligationStatuses.irf}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="ITS (Impôts sur les traitements, salaires et rentes viagères)"
              keyName="its"
              status={obligationStatuses.its}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="Précompte sur loyer"
              keyName="precompte"
              status={obligationStatuses.precompte}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="Taxe de séjour"
              keyName="taxeSejour"
              status={obligationStatuses.taxeSejour}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="Bail Commercial"
              keyName="baillCommercial"
              status={obligationStatuses.baillCommercial}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Déclarations obligatoires annuelles</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <DeclarationObligationItem
              title="DSF (Déclaration Statistique et Fiscale)"
              keyName="dsf"
              status={obligationStatuses.dsf as DeclarationObligationStatus}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, true, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
              periodicity="annual"
            />
            
            <DeclarationObligationItem
              title="DARP (Déclaration Annuelle des Revenus des Particuliers)"
              keyName="darp"
              status={obligationStatuses.darp as DeclarationObligationStatus}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, true, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
              periodicity="annual"
            />
            
            <DeclarationObligationItem
              title="Licence"
              keyName="licence"
              status={obligationStatuses.licence as DeclarationObligationStatus}
              onStatusChange={handleStatusChangeAdapter}
              onAttachmentChange={(key, attachmentType, filePath) => 
                handleAttachmentChangeAdapter(key, true, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
              periodicity="annual"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-sm">Déclarations obligatoires mensuelles</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Aucune déclaration mensuelle pour l'instant - sera ajoutée ultérieurement si nécessaire */}
            <div className="p-4 border border-dashed rounded-lg bg-muted/20 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Les déclarations mensuelles seront ajoutées prochainement
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
