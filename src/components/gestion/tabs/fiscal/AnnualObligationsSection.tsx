
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TaxObligationItem } from './TaxObligationItem';
import { DeclarationObligationItem } from './DeclarationObligationItem';
import { FiscalBulkUpdateButton } from './FiscalBulkUpdateButton';
import { ObligationStatuses, TaxObligationStatus, DeclarationObligationStatus } from '@/hooks/fiscal/types';

interface AnnualObligationsSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  onAttachmentChange: (obligation: string, isDeclaration: boolean, attachmentType: string, filePath: string) => void;
  clientId: string;
  selectedYear: string;
  isDeclarationObligation?: (obligation: string) => boolean;
}

export function AnnualObligationsSection({
  obligationStatuses,
  handleStatusChange,
  onAttachmentChange,
  clientId,
  selectedYear,
  isDeclarationObligation = (obligation) => ['dsf', 'darp', 'licence'].includes(obligation)
}: AnnualObligationsSectionProps) {
  const [showIGSPanel, setShowIGSPanel] = useState<boolean>(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Obligations fiscales pour {selectedYear}</h3>
        <FiscalBulkUpdateButton 
          obligationStatuses={obligationStatuses} 
          handleStatusChange={handleStatusChange} 
          isDeclarationObligation={isDeclarationObligation}
        />
      </div>

      <Accordion type="multiple" defaultValue={["impots-directs", "declarations"]}>
        <AccordionItem value="impots-directs">
          <AccordionTrigger className="text-base font-medium">Impôts directs</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <TaxObligationItem
              keyName="igs"
              title="Impôt Général sur les Sociétés (IGS)"
              status={obligationStatuses.igs as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
              showIGSPanel={showIGSPanel}
              onToggleIGSPanel={() => setShowIGSPanel(!showIGSPanel)}
            />
            <TaxObligationItem
              keyName="patente"
              title="Patente"
              status={obligationStatuses.patente as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              keyName="iba"
              title="Impôts sur les Bénéfices Agricoles (IBA)"
              status={obligationStatuses.iba as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              keyName="baic"
              title="Impôts sur les Bénéfices Artisanaux, Industriels et Commerciaux (BAIC)"
              status={obligationStatuses.baic as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              keyName="ibnc"
              title="Impôts sur les Bénéfices des Professions Non Commerciales (IBNC)"
              status={obligationStatuses.ibnc as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              keyName="ircm"
              title="Impôts sur les Revenus des Capitaux Mobiliers (IRCM)"
              status={obligationStatuses.ircm as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              keyName="irf"
              title="Impôts sur les Revenus Fonciers (IRF)"
              status={obligationStatuses.irf as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              keyName="its"
              title="Impôts sur les Traitements, Salaires (ITS)"
              status={obligationStatuses.its as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              keyName="precompte"
              title="Précompte sur Loyer"
              status={obligationStatuses.precompte as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              keyName="taxeSejour"
              title="Taxe de Séjour"
              status={obligationStatuses.taxeSejour as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              keyName="baillCommercial"
              title="Bail Commercial"
              status={obligationStatuses.baillCommercial as TaxObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, false, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="declarations">
          <AccordionTrigger className="text-base font-medium">Déclarations obligatoires</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <DeclarationObligationItem
              keyName="dsf"
              title="Déclaration Statistique et Fiscale (DSF)"
              status={obligationStatuses.dsf as DeclarationObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, true, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <DeclarationObligationItem
              keyName="darp"
              title="Déclaration Annuelle des Retenues à la Source (DARS)"
              status={obligationStatuses.darp as DeclarationObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, true, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <DeclarationObligationItem
              keyName="licence"
              title="Licence"
              status={obligationStatuses.licence as DeclarationObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(key, attachmentType, filePath) => onAttachmentChange(key, true, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
