
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ObligationStatuses } from '@/hooks/fiscal/types';
import { TaxObligationItem } from './TaxObligationItem';

interface DirectTaxesSectionProps {
  clientId: string;
  selectedYear: string;
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  handleAttachmentChange: (obligation: string, attachmentType: string, filePath: string | null) => void;
  isTaxObligation: (obligation: string) => boolean;
}

export const DirectTaxesSection: React.FC<DirectTaxesSectionProps> = ({ 
  clientId,
  selectedYear,
  obligationStatuses,
  handleStatusChange,
  handleAttachmentChange,
  isTaxObligation
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Impôts directs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TaxObligationItem
          title="Impôt Général Synthétique (IGS)"
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
        <TaxObligationItem
          title="Licence"
          keyName="licence"
          status={obligationStatuses.licence}
          onStatusChange={handleStatusChange}
          onAttachmentChange={handleAttachmentChange}
          clientId={clientId}
          selectedYear={selectedYear}
        />
        <TaxObligationItem
          title="Bail Commercial"
          keyName="bailCommercial"
          status={obligationStatuses.bailCommercial}
          onStatusChange={handleStatusChange}
          onAttachmentChange={handleAttachmentChange}
          clientId={clientId}
          selectedYear={selectedYear}
        />
        <TaxObligationItem
          title="Précompte Loyer"
          keyName="precompteLoyer"
          status={obligationStatuses.precompteLoyer}
          onStatusChange={handleStatusChange}
          onAttachmentChange={handleAttachmentChange}
          clientId={clientId}
          selectedYear={selectedYear}
        />
        <TaxObligationItem
          title="Taxe sur la propriété (TPF)"
          keyName="tpf"
          status={obligationStatuses.tpf}
          onStatusChange={handleStatusChange}
          onAttachmentChange={handleAttachmentChange}
          clientId={clientId}
          selectedYear={selectedYear}
        />
      </CardContent>
    </Card>
  );
};
