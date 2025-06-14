
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ObligationStatuses, ObligationType, TaxObligationStatus, IgsObligationStatus } from '@/hooks/fiscal/types';
import { formatNumberWithSpaces, parseFormattedNumber } from '@/utils/numberFormatting';
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

  const igsStatus = obligationStatuses.igs as IgsObligationStatus;

  const [quarterlyPayments, setQuarterlyPayments] = useState<Record<string, string>>({
    q1: '', q2: '', q3: '', q4: ''
  });
  const [quarterlyDates, setQuarterlyDates] = useState<Record<string, string>>({
    q1: '', q2: '', q3: '', q4: ''
  });

  // Sync local formatted state from global igsStatus (for inputs)
  useEffect(() => {
    if (igsStatus) {
      setQuarterlyPayments({
        q1: formatNumberWithSpaces(String(igsStatus.q1Montant || '')),
        q2: formatNumberWithSpaces(String(igsStatus.q2Montant || '')),
        q3: formatNumberWithSpaces(String(igsStatus.q3Montant || '')),
        q4: formatNumberWithSpaces(String(igsStatus.q4Montant || ''))
      });
      setQuarterlyDates({
        q1: igsStatus.q1Date || '',
        q2: igsStatus.q2Date || '',
        q3: igsStatus.q3Date || '',
        q4: igsStatus.q4Date || ''
      });
    }
  }, [
    igsStatus?.q1Montant, igsStatus?.q2Montant, igsStatus?.q3Montant, igsStatus?.q4Montant,
    igsStatus?.q1Date, igsStatus?.q2Date, igsStatus?.q3Date, igsStatus?.q4Date,
    // Add igsStatus itself to re-evaluate if the object reference changes,
    // ensuring initial load and reset scenarios are handled.
    igsStatus 
  ]);

  // Update IGS calculation when revenue (caValue) or CGA status changes
  useEffect(() => {
    const caNum = parseFormattedNumber(igsStatus?.caValue);
    // Only calculate if caNum is positive. If caValue is empty or zero, it will be handled.
    // An explicit check for igsStatus.caValue being undefined or empty might be good too.
    if (igsStatus && (typeof igsStatus.caValue === 'string' || typeof igsStatus.caValue === 'number')) {
      if (igsStatus.caValue === '' || caNum === 0) {
        handleStatusChange('igs', 'classe', '-');
        handleStatusChange('igs', 'montantAnnuel', 0);
        handleStatusChange('igs', 'outOfRange', false);
      } else {
        const result = calculateIGS(caNum, igsStatus.isCGA || false);
        handleStatusChange('igs', 'classe', result.class);
        handleStatusChange('igs', 'montantAnnuel', result.amount);
        handleStatusChange('igs', 'outOfRange', result.outOfRange);
      }
    }
  }, [igsStatus?.caValue, igsStatus?.isCGA, handleStatusChange]); // Removed calculateIGS as it's stable

  // Effect to update global IGS status (qXMontant, montantTotalPaye, soldeRestant)
  // based on local quarterlyPayments (user input) and igsStatus.montantAnnuel.
  useEffect(() => {
    if (!igsStatus) return; // Guard clause

    const q1Amount = parseFormattedNumber(quarterlyPayments.q1);
    const q2Amount = parseFormattedNumber(quarterlyPayments.q2);
    const q3Amount = parseFormattedNumber(quarterlyPayments.q3);
    const q4Amount = parseFormattedNumber(quarterlyPayments.q4);
  
    if (igsStatus.q1Montant !== q1Amount) {
      handleStatusChange('igs', 'q1Montant', q1Amount);
    }
    if (igsStatus.q2Montant !== q2Amount) {
      handleStatusChange('igs', 'q2Montant', q2Amount);
    }
    if (igsStatus.q3Montant !== q3Amount) {
      handleStatusChange('igs', 'q3Montant', q3Amount);
    }
    if (igsStatus.q4Montant !== q4Amount) {
      handleStatusChange('igs', 'q4Montant', q4Amount);
    }
  
    const totalPaid = q1Amount + q2Amount + q3Amount + q4Amount;
    const currentMontantAnnuel = igsStatus.montantAnnuel || 0; // montantAnnuel is source of truth from calculation
    const soldeRestant = Math.max(0, currentMontantAnnuel - totalPaid);
  
    if (igsStatus.montantTotalPaye !== totalPaid) {
      handleStatusChange('igs', 'montantTotalPaye', totalPaid);
    }
    if (igsStatus.soldeRestant !== soldeRestant) {
      handleStatusChange('igs', 'soldeRestant', soldeRestant);
    }
  }, [
    quarterlyPayments, 
    igsStatus, // Full igsStatus to react to montantAnnuel changes correctly
    handleStatusChange
  ]);
  
  // Effect to update global IGS dates based on local quarterlyDates
  useEffect(() => {
    if (!igsStatus) return; // Guard clause

    if (igsStatus.q1Date !== quarterlyDates.q1) {
      handleStatusChange('igs', 'q1Date', quarterlyDates.q1);
    }
    if (igsStatus.q2Date !== quarterlyDates.q2) {
      handleStatusChange('igs', 'q2Date', quarterlyDates.q2);
    }
    if (igsStatus.q3Date !== quarterlyDates.q3) {
      handleStatusChange('igs', 'q3Date', quarterlyDates.q3);
    }
    if (igsStatus.q4Date !== quarterlyDates.q4) {
      handleStatusChange('igs', 'q4Date', quarterlyDates.q4);
    }
  }, [
    quarterlyDates, 
    igsStatus, // Full igsStatus for initial sync and comparison
    handleStatusChange
  ]);

  const toggleDetails = useCallback((taxType: string) => {
    setOpenedDetails(prev => ({ ...prev, [taxType]: !prev[taxType] }));
  }, []);

  const handleCAInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleStatusChange('igs', 'caValue', formatNumberWithSpaces(e.target.value));
  }, [handleStatusChange]);

  const handleCGAInputChange = useCallback((checked: boolean) => {
    handleStatusChange('igs', 'isCGA', checked);
  }, [handleStatusChange]);

  const handleLocalQuarterlyPaymentChange = useCallback((quarter: string, value: string) => {
    setQuarterlyPayments(prev => ({ ...prev, [quarter]: formatNumberWithSpaces(value) }));
  }, []);

  const handleLocalQuarterlyDateChange = useCallback((quarter: string, value: string) => {
    setQuarterlyDates(prev => ({ ...prev, [quarter]: value }));
  }, []);
  
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
      <CardContent className="space-y-0"> {/* Adjusted space-y for item margin */}
        {taxItems.map(item => {
          const obligation = obligationStatuses[item.key];
          if (!obligation || typeof obligation.assujetti === 'undefined') return null; // Basic check

          let igsSpecifics;
          if (item.key === 'igs' && igsStatus) {
            igsSpecifics = {
              caValue: igsStatus.caValue || '',
              isCGA: igsStatus.isCGA || false,
              onCAChange: handleCAInputChange,
              onCGAChange: handleCGAInputChange,
              quarterlyPayments: quarterlyPayments,
              quarterlyDates: quarterlyDates,
              onQuarterlyPaymentChange: handleLocalQuarterlyPaymentChange,
              onQuarterlyDateChange: handleLocalQuarterlyDateChange,
              currentIgsStatusForDisplay: igsStatus, // Pass the full, current IGS status
            };
          }

          return (
            <DirectTaxItemRenderer
              key={item.key}
              taxKey={item.key}
              taxName={item.name}
              obligation={obligation as TaxObligationStatus} // Cast, assuming valid structure after check
              isDetailsOpened={openedDetails[item.key] || false}
              onToggleDetails={() => toggleDetails(item.key)}
              handleStatusChange={handleStatusChange}
              igsSpecificProps={igsSpecifics}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};

