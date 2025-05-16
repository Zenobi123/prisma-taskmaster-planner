
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
              name="igs"
              nameLabel="Impôt Général sur les Sociétés (IGS)"
              status={obligationStatuses.igs as TaxObligationStatus}
              onChange={(field, value) => handleStatusChange("igs", field, value)}
              isIgsObligation={true}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              name="patente"
              nameLabel="Patente"
              status={obligationStatuses.patente as TaxObligationStatus}
              onChange={(field, value) => handleStatusChange("patente", field, value)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              name="iba"
              nameLabel="Impôts sur les Bénéfices Agricoles (IBA)"
              status={obligationStatuses.iba as TaxObligationStatus}
              onChange={(field, value) => handleStatusChange("iba", field, value)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              name="baic"
              nameLabel="Impôts sur les Bénéfices Artisanaux, Industriels et Commerciaux (BAIC)"
              status={obligationStatuses.baic as TaxObligationStatus}
              onChange={(field, value) => handleStatusChange("baic", field, value)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              name="ibnc"
              nameLabel="Impôts sur les Bénéfices des Professions Non Commerciales (IBNC)"
              status={obligationStatuses.ibnc as TaxObligationStatus}
              onChange={(field, value) => handleStatusChange("ibnc", field, value)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              name="ircm"
              nameLabel="Impôts sur les Revenus des Capitaux Mobiliers (IRCM)"
              status={obligationStatuses.ircm as TaxObligationStatus}
              onChange={(field, value) => handleStatusChange("ircm", field, value)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              name="irf"
              nameLabel="Impôts sur les Revenus Fonciers (IRF)"
              status={obligationStatuses.irf as TaxObligationStatus}
              onChange={(field, value) => handleStatusChange("irf", field, value)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              name="its"
              nameLabel="Impôts sur les Traitements, Salaires (ITS)"
              status={obligationStatuses.its as TaxObligationStatus}
              onChange={(field, value) => handleStatusChange("its", field, value)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              name="precompte"
              nameLabel="Précompte sur Loyer"
              status={obligationStatuses.precompte as TaxObligationStatus}
              onChange={(field, value) => handleStatusChange("precompte", field, value)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              name="taxeSejour"
              nameLabel="Taxe de Séjour"
              status={obligationStatuses.taxeSejour as TaxObligationStatus}
              onChange={(field, value) => handleStatusChange("taxeSejour", field, value)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <TaxObligationItem
              name="baillCommercial"
              nameLabel="Bail Commercial"
              status={obligationStatuses.baillCommercial as TaxObligationStatus}
              onChange={(field, value) => handleStatusChange("baillCommercial", field, value)}
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
              onAttachmentChange={(obligation, attachmentType, filePath) => 
                onAttachmentChange(obligation, true, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <DeclarationObligationItem
              keyName="darp"
              title="Déclaration Annuelle des Retenues à la Source (DARS)"
              status={obligationStatuses.darp as DeclarationObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(obligation, attachmentType, filePath) => 
                onAttachmentChange(obligation, true, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
            <DeclarationObligationItem
              keyName="licence"
              title="Licence"
              status={obligationStatuses.licence as DeclarationObligationStatus}
              onStatusChange={handleStatusChange}
              onAttachmentChange={(obligation, attachmentType, filePath) => 
                onAttachmentChange(obligation, true, attachmentType, filePath)}
              clientId={clientId}
              selectedYear={selectedYear}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
