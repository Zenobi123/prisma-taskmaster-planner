
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ObligationStatuses } from '@/hooks/fiscal/types';
import { DeclarationObligationItem } from './DeclarationObligationItem';
import { FiscalBulkUpdateButton } from './FiscalBulkUpdateButton';

interface MonthlyObligationsSectionProps {
  clientId: string;
  selectedYear: string;
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  handleAttachmentChange: (obligation: string, attachmentType: string, filePath: string | null) => void;
  isDeclarationObligation: (obligation: string) => boolean;
}

export function MonthlyObligationsSection({
  clientId,
  selectedYear,
  obligationStatuses,
  handleStatusChange,
  handleAttachmentChange,
  isDeclarationObligation
}: MonthlyObligationsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Obligations mensuelles</CardTitle>
        <FiscalBulkUpdateButton 
          obligationStatuses={obligationStatuses} 
          onStatusChange={handleStatusChange}
          isDeclarationObligation={isDeclarationObligation}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <DeclarationObligationItem
          title="Cotisations Nationales de Prévoyance Sociale (CNPS)"
          keyName="cntps"
          status={obligationStatuses.cntps}
          onStatusChange={handleStatusChange}
          onAttachmentChange={handleAttachmentChange}
          clientId={clientId}
          selectedYear={selectedYear}
        />
        <DeclarationObligationItem
          title="Précomptes à la source (IRPP, TVA)"
          keyName="precomptes"
          status={obligationStatuses.precomptes}
          onStatusChange={handleStatusChange}
          onAttachmentChange={handleAttachmentChange}
          clientId={clientId}
          selectedYear={selectedYear}
        />
      </CardContent>
    </Card>
  );
}
