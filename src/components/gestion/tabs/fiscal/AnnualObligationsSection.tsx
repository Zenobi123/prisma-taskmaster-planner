
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ObligationStatuses } from '@/hooks/fiscal/types';
import { DeclarationObligationItem } from './DeclarationObligationItem';
import { FiscalBulkUpdateButton } from './FiscalBulkUpdateButton';
import { Client } from '@/types/client';

interface AnnualObligationsSectionProps {
  clientId: string;
  selectedYear: string;
  selectedClient: Client;
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  handleAttachmentChange: (obligation: string, attachmentType: string, filePath: string | null) => void;
  isDeclarationObligation: (obligation: string) => boolean;
}

export function AnnualObligationsSection({
  clientId,
  selectedYear,
  selectedClient,
  obligationStatuses,
  handleStatusChange,
  handleAttachmentChange,
  isDeclarationObligation
}: AnnualObligationsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Obligations annuelles</CardTitle>
        <FiscalBulkUpdateButton 
          obligationStatuses={obligationStatuses} 
          onStatusChange={handleStatusChange}
          isDeclarationObligation={isDeclarationObligation}
        />
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
        <DeclarationObligationItem
          title="Déclaration Statistique et Fiscale (DSF)"
          keyName="dsf"
          status={obligationStatuses.dsf}
          onStatusChange={handleStatusChange}
          onAttachmentChange={handleAttachmentChange}
          clientId={clientId}
          selectedYear={selectedYear}
        />
        
        {/* DARP uniquement pour les personnes physiques */}
        {selectedClient.type === "physique" && (
          <DeclarationObligationItem
            title="Déclaration Annuelle des Revenus des Particuliers (DARP)"
            keyName="darp"
            status={obligationStatuses.darp}
            onStatusChange={handleStatusChange}
            onAttachmentChange={handleAttachmentChange}
            clientId={clientId}
            selectedYear={selectedYear}
          />
        )}
        
        {/* DBEF uniquement pour les personnes morales */}
        {selectedClient.type === "morale" && (
          <DeclarationObligationItem
            title="Déclaration des Bénéficiaires Effectifs (DBEF)"
            keyName="dbef"
            status={obligationStatuses.dbef}
            onStatusChange={handleStatusChange}
            onAttachmentChange={handleAttachmentChange}
            clientId={clientId}
            selectedYear={selectedYear}
          />
        )}
      </CardContent>
    </Card>
  );
}
