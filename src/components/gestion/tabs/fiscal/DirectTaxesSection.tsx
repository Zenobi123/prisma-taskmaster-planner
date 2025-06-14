
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

  // États locaux pour les inputs formatés - stabilisés avec useMemo
  const initialQuarterlyPayments = useMemo(() => ({
    q1: formatNumberWithSpaces(String(igsStatus?.q1Montant || '')),
    q2: formatNumberWithSpaces(String(igsStatus?.q2Montant || '')),
    q3: formatNumberWithSpaces(String(igsStatus?.q3Montant || '')),
    q4: formatNumberWithSpaces(String(igsStatus?.q4Montant || ''))
  }), [igsStatus?.q1Montant, igsStatus?.q2Montant, igsStatus?.q3Montant, igsStatus?.q4Montant]);

  const initialQuarterlyDates = useMemo(() => ({
    q1: igsStatus?.q1Date || '',
    q2: igsStatus?.q2Date || '',
    q3: igsStatus?.q3Date || '',
    q4: igsStatus?.q4Date || ''
  }), [igsStatus?.q1Date, igsStatus?.q2Date, igsStatus?.q3Date, igsStatus?.q4Date]);

  const [quarterlyPayments, setQuarterlyPayments] = useState(initialQuarterlyPayments);
  const [quarterlyDates, setQuarterlyDates] = useState(initialQuarterlyDates);

  // Synchronisation une seule fois lors du changement des valeurs globales
  useEffect(() => {
    setQuarterlyPayments(initialQuarterlyPayments);
  }, [initialQuarterlyPayments]);

  useEffect(() => {
    setQuarterlyDates(initialQuarterlyDates);
  }, [initialQuarterlyDates]);

  // Calcul IGS stabilisé avec useMemo et debounce
  const igsCalculationResult = useMemo(() => {
    if (!igsStatus || !igsStatus.caValue) {
      return { class: '-', amount: 0, outOfRange: false };
    }
    
    const caNum = parseFormattedNumber(igsStatus.caValue);
    if (caNum === 0) {
      return { class: '-', amount: 0, outOfRange: false };
    }
    
    return calculateIGS(caNum, igsStatus.isCGA || false);
  }, [igsStatus?.caValue, igsStatus?.isCGA]);

  // Mise à jour du calcul IGS seulement si les valeurs ont vraiment changé
  useEffect(() => {
    if (!igsStatus) return;
    
    const currentResult = igsCalculationResult;
    
    // Éviter les mises à jour inutiles
    if (igsStatus.classe !== currentResult.class ||
        igsStatus.montantAnnuel !== currentResult.amount ||
        igsStatus.outOfRange !== currentResult.outOfRange) {
      
      handleStatusChange('igs', 'classe', currentResult.class);
      handleStatusChange('igs', 'montantAnnuel', currentResult.amount);
      handleStatusChange('igs', 'outOfRange', currentResult.outOfRange);
    }
  }, [igsCalculationResult, igsStatus?.classe, igsStatus?.montantAnnuel, igsStatus?.outOfRange, handleStatusChange]);

  // Calculs des totaux stabilisés
  const calculatedTotals = useMemo(() => {
    const q1Amount = parseFormattedNumber(quarterlyPayments.q1);
    const q2Amount = parseFormattedNumber(quarterlyPayments.q2);
    const q3Amount = parseFormattedNumber(quarterlyPayments.q3);
    const q4Amount = parseFormattedNumber(quarterlyPayments.q4);
    
    const totalPaid = q1Amount + q2Amount + q3Amount + q4Amount;
    const currentMontantAnnuel = igsStatus?.montantAnnuel || 0;
    const soldeRestant = Math.max(0, currentMontantAnnuel - totalPaid);
    
    return { q1Amount, q2Amount, q3Amount, q4Amount, totalPaid, soldeRestant };
  }, [quarterlyPayments, igsStatus?.montantAnnuel]);

  // Mise à jour des montants trimestriels et totaux - avec comparaison pour éviter les boucles
  useEffect(() => {
    if (!igsStatus) return;

    const { q1Amount, q2Amount, q3Amount, q4Amount, totalPaid, soldeRestant } = calculatedTotals;
    
    // Mise à jour seulement si les valeurs ont vraiment changé
    const updates: Array<{ field: string; value: number }> = [];
    
    if (igsStatus.q1Montant !== q1Amount) updates.push({ field: 'q1Montant', value: q1Amount });
    if (igsStatus.q2Montant !== q2Amount) updates.push({ field: 'q2Montant', value: q2Amount });
    if (igsStatus.q3Montant !== q3Amount) updates.push({ field: 'q3Montant', value: q3Amount });
    if (igsStatus.q4Montant !== q4Amount) updates.push({ field: 'q4Montant', value: q4Amount });
    if (igsStatus.montantTotalPaye !== totalPaid) updates.push({ field: 'montantTotalPaye', value: totalPaid });
    if (igsStatus.soldeRestant !== soldeRestant) updates.push({ field: 'soldeRestant', value: soldeRestant });
    
    // Appliquer toutes les mises à jour en une fois
    updates.forEach(({ field, value }) => {
      handleStatusChange('igs', field, value);
    });
  }, [calculatedTotals, igsStatus, handleStatusChange]);

  // Mise à jour des dates
  useEffect(() => {
    if (!igsStatus) return;

    const updates: Array<{ field: string; value: string }> = [];
    
    if (igsStatus.q1Date !== quarterlyDates.q1) updates.push({ field: 'q1Date', value: quarterlyDates.q1 });
    if (igsStatus.q2Date !== quarterlyDates.q2) updates.push({ field: 'q2Date', value: quarterlyDates.q2 });
    if (igsStatus.q3Date !== quarterlyDates.q3) updates.push({ field: 'q3Date', value: quarterlyDates.q3 });
    if (igsStatus.q4Date !== quarterlyDates.q4) updates.push({ field: 'q4Date', value: quarterlyDates.q4 });
    
    updates.forEach(({ field, value }) => {
      handleStatusChange('igs', field, value);
    });
  }, [quarterlyDates, igsStatus, handleStatusChange]);

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
      <CardContent className="space-y-0">
        {taxItems.map(item => {
          const obligation = obligationStatuses[item.key];
          if (!obligation || typeof obligation.assujetti === 'undefined') return null;

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
              currentIgsStatusForDisplay: igsStatus,
            };
          }

          return (
            <DirectTaxItemRenderer
              key={item.key}
              taxKey={item.key}
              taxName={item.name}
              obligation={obligation as TaxObligationStatus}
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
