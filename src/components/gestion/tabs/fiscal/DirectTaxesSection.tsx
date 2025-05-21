
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ObligationStatuses } from '@/hooks/fiscal/types';
import { TaxObligationItem } from './TaxObligationItem';
import { FiscalBulkUpdateButton } from './FiscalBulkUpdateButton';

interface DirectTaxesSectionProps {
  clientId: string;
  selectedYear: string;
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  handleAttachmentChange: (obligation: string, attachmentType: string, filePath: string | null) => void;
  isDeclarationObligation: (obligation: string) => boolean;
}

export function DirectTaxesSection({
  clientId,
  selectedYear,
  obligationStatuses,
  handleStatusChange,
  handleAttachmentChange,
  isDeclarationObligation
}: DirectTaxesSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Impôts directs</CardTitle>
        <FiscalBulkUpdateButton 
          obligationStatuses={obligationStatuses} 
          onStatusChange={handleStatusChange}
          isDeclarationObligation={isDeclarationObligation}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <TaxObligationItem
          title="Impôt Général sur les Sociétés (IGS)"
          keyName="igs"
          status={obligationStatuses.igs}
          onStatusChange={handleStatusChange}
          onAttachmentChange={handleAttachmentChange}
          clientId={clientId}
          selectedYear={selectedYear}
        />
        <TaxObligationItem
          title="Patente"
          keyName="patente"
          status={obligationStatuses.patente}
          onStatusChange={handleStatusChange}
          onAttachmentChange={handleAttachmentChange}
          clientId={clientId}
          selectedYear={selectedYear}
        />
      </CardContent>
    </Card>
  );
}
