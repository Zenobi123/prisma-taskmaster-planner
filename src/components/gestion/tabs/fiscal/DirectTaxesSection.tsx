import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ObligationStatuses, ObligationType, IgsObligationStatus, TaxObligationStatus } from '@/hooks/fiscal/types';
import { calculateIGS } from '@/calculators/igsCalculator';
import { DirectTaxItemRenderer } from './DirectTaxItemRenderer';

interface DirectTaxesSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (taxType: ObligationType, field: string, value: boolean | string | number) => void;
}

export const DirectTaxesSection: React.FC<DirectTaxesSectionProps> = ({ 
  obligationStatuses,
  handleStatusChange 
}) => {
  const [openedDetails, setOpenedDetails] = useState<Record<string, boolean>>({});

  // Simplification : on base tout affichage/calcul uniquement sur l'objet obligationStatuses
  const igsStatus = obligationStatuses.igs as IgsObligationStatus;

  // Pour simplifier : plus d'états locaux pour les paiements ou datas, tout vient du state global (obligationStatuses)
  // Calcul IGS central
  const caNum = igsStatus.caValue ? parseInt((igsStatus.caValue + '').replace(/\s/g, "")) : 0;
  const isCGA = !!igsStatus.isCGA;
  const calculation = calculateIGS(caNum, isCGA);

  // Montants trimestriels
  const q1Amount = igsStatus.q1Montant || 0;
  const q2Amount = igsStatus.q2Montant || 0;
  const q3Amount = igsStatus.q3Montant || 0;
  const q4Amount = igsStatus.q4Montant || 0;
  const montantTotalPaye = q1Amount + q2Amount + q3Amount + q4Amount;
  const soldeRestant = Math.max(0, calculation.amount - montantTotalPaye);

  // Handler pour changer le CA
  const handleCAInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleStatusChange('igs', 'caValue', e.target.value);
  };

  const handleCGAInputChange = (checked: boolean) => {
    handleStatusChange('igs', 'isCGA', checked);
  };

  const handleQuarterlyPaymentChange = (quarter: string, value: string) => {
    handleStatusChange('igs', `${quarter}Montant`, parseInt(value.replace(/\s/g, "")) || 0);
  };

  const handleQuarterlyDateChange = (quarter: string, value: string) => {
    handleStatusChange('igs', `${quarter}Date`, value);
  };

  const toggleDetails = (taxType: string) => {
    setOpenedDetails((prev) => ({
      ...prev,
      [taxType]: !prev[taxType],
    }));
  };

  const taxItems: { key: ObligationType; name: string }[] = [
    { key: 'igs', name: 'Impôt Général Synthétique (IGS)' },
    { key: 'patente', name: 'Patente' },
    { key: 'bailCommercial', name: 'Bail Commercial' },
    { key: 'tpf', name: 'Taxe sur la propriété (TPF)' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Impôts directs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {taxItems.map(item => {
          const obligation = obligationStatuses[item.key];

          if (!obligation || typeof obligation.assujetti === "undefined") return null;

          // Type guard pour vérifier si c'est une TaxObligationStatus
          const isTaxObligation = (obs: typeof obligation): obs is TaxObligationStatus => {
            return "payee" in obs;
          };

          if (!isTaxObligation(obligation)) return null;

          let igsSpecifics;
          if (item.key === "igs" && igsStatus) {
            igsSpecifics = {
              caValue: igsStatus.caValue || "",
              isCGA: igsStatus.isCGA || false,
              onCAChange: handleCAInputChange,
              onCGAChange: handleCGAInputChange,
              quarterlyPayments: {
                q1: igsStatus.q1Montant?.toLocaleString('fr-FR') || "",
                q2: igsStatus.q2Montant?.toLocaleString('fr-FR') || "",
                q3: igsStatus.q3Montant?.toLocaleString('fr-FR') || "",
                q4: igsStatus.q4Montant?.toLocaleString('fr-FR') || "",
              },
              quarterlyDates: {
                q1: igsStatus.q1Date || "",
                q2: igsStatus.q2Date || "",
                q3: igsStatus.q3Date || "",
                q4: igsStatus.q4Date || "",
              },
              onQuarterlyPaymentChange: handleQuarterlyPaymentChange,
              onQuarterlyDateChange: handleQuarterlyDateChange,
              currentIgsStatusForDisplay: {
                ...igsStatus,
                classe: calculation.class,
                montantAnnuel: calculation.amount,
                outOfRange: calculation.outOfRange,
                q1Amount,
                q2Amount,
                q3Amount,
                q4Amount,
                montantTotalPaye,
                soldeRestant,
              },
            };
          }

          if (item.key === "igs" && obligation.assujetti) {
            return (
              <DirectTaxItemRenderer
                key={item.key}
                taxKey={item.key}
                taxName={item.name}
                obligation={obligation}
                isDetailsOpened={openedDetails[item.key] || false}
                onToggleDetails={() => toggleDetails(item.key)}
                handleStatusChange={handleStatusChange}
                igsSpecificProps={igsSpecifics}
              />
            );
          }

          if (!obligation.assujetti) return null;
          return (
            <DirectTaxItemRenderer
              key={item.key}
              taxKey={item.key}
              taxName={item.name}
              obligation={obligation}
              isDetailsOpened={openedDetails[item.key] || false}
              onToggleDetails={() => toggleDetails(item.key)}
              handleStatusChange={handleStatusChange}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};
