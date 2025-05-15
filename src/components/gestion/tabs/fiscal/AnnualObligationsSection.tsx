
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
              status={obligationStatuses.igs as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
              showIGSPanel={true}
            />
            
            <TaxObligationItem
              title="Patente"
              keyName="patente"
              status={obligationStatuses.patente as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="BAIC (Impôts sur les Bénéfices Artisanaux, Industriels et Commerciaux)"
              keyName="baic"
              status={obligationStatuses.baic as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="IBA (Impôts sur les Bénéfices Agricoles)"
              keyName="iba"
              status={obligationStatuses.iba as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="IBNC (Impôts sur les Bénéfices des Professions Non Commerciales)"
              keyName="ibnc"
              status={obligationStatuses.ibnc as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="IRCM (Impôts sur les Revenus des Capitaux Mobiliers)"
              keyName="ircm"
              status={obligationStatuses.ircm as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="IRF (Impôts sur les Revenus Fonciers)"
              keyName="irf"
              status={obligationStatuses.irf as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="ITS (Impôts sur les traitements, salaires et rentes viagères)"
              keyName="its"
              status={obligationStatuses.its as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="Précompte sur loyer"
              keyName="precompte"
              status={obligationStatuses.precompte as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="Taxe de séjour"
              keyName="taxeSejour"
              status={obligationStatuses.taxeSejour as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />

            <TaxObligationItem
              title="Bail Commercial"
              keyName="baillCommercial"
              status={obligationStatuses.baillCommercial as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, false, attachmentType, filePath)}
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
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, true, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
              periodicity="annual"
            />
            
            <DeclarationObligationItem
              title="DARP (Déclaration Annuelle des Revenus des Particuliers)"
              keyName="darp"
              status={obligationStatuses.darp as DeclarationObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, true, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
              periodicity="annual"
            />
            
            <DeclarationObligationItem
              title="Licence"
              keyName="licence"
              status={obligationStatuses.licence as DeclarationObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => 
                onAttachmentChange(key, true, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
              periodicity="annual"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-sm">Déclarations obligatoires mensuelles</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Monthly declarations will be added later if needed */}
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
