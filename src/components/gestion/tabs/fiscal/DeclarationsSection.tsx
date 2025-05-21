
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ObligationStatuses } from '@/hooks/fiscal/types';
import { DeclarationObligationItem } from './DeclarationObligationItem';
import { FiscalBulkUpdateButton } from './FiscalBulkUpdateButton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface DeclarationsSectionProps {
  clientId: string;
  selectedYear: string;
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  handleAttachmentChange: (obligation: string, attachmentType: string, filePath: string | null) => void;
  isDeclarationObligation: (obligation: string) => boolean;
}

export function DeclarationsSection({
  clientId,
  selectedYear,
  obligationStatuses,
  handleStatusChange,
  handleAttachmentChange,
  isDeclarationObligation
}: DeclarationsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("annual");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Déclarations</CardTitle>
        <FiscalBulkUpdateButton 
          obligationStatuses={obligationStatuses} 
          onStatusChange={handleStatusChange}
          isDeclarationObligation={isDeclarationObligation}
        />
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="annual">Annuelles</TabsTrigger>
            <TabsTrigger value="monthly">Mensuelles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="annual" className="space-y-4">
            <DeclarationObligationItem
              title="Déclaration Statistique et Fiscale (DSF)"
              keyName="dsf"
              status={obligationStatuses.dsf}
              onStatusChange={handleStatusChange}
              onAttachmentChange={handleAttachmentChange}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <DeclarationObligationItem
              title="Déclaration Annuelle des Revenus Professionnels (DARP)"
              keyName="darp"
              status={obligationStatuses.darp}
              onStatusChange={handleStatusChange}
              onAttachmentChange={handleAttachmentChange}
              clientId={clientId}
              selectedYear={selectedYear}
            />
          </TabsContent>
          
          <TabsContent value="monthly" className="space-y-4">
            <DeclarationObligationItem
              title="CNPS"
              keyName="cntps"
              status={obligationStatuses.cntps}
              onStatusChange={handleStatusChange}
              onAttachmentChange={handleAttachmentChange}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <DeclarationObligationItem
              title="Précomptes"
              keyName="precomptes"
              status={obligationStatuses.precomptes}
              onStatusChange={handleStatusChange}
              onAttachmentChange={handleAttachmentChange}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <DeclarationObligationItem
              title="Licence"
              keyName="licence"
              status={obligationStatuses.licence}
              onStatusChange={handleStatusChange}
              onAttachmentChange={handleAttachmentChange}
              clientId={clientId}
              selectedYear={selectedYear}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
