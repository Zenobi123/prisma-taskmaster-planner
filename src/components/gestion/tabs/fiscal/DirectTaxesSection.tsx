
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ObligationStatuses, ObligationType, IgsObligationStatus, TaxObligationStatus } from '@/hooks/fiscal/types';
import { formatNumberWithSpaces, parseFormattedNumber } from '@/utils/numberFormatting';
import { calculateIGS } from '@/calculators/igsCalculator';
import { DirectTaxItemRenderer } from './DirectTaxItemRenderer';
import { useStableStatusChange } from '@/hooks/fiscal/useStableStatusChange';

interface DirectTaxesSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (taxType: ObligationType, field: string, value: boolean | string | number) => void;
}

export const DirectTaxesSection: React.FC<DirectTaxesSectionProps> = ({ 
  obligationStatuses,
  handleStatusChange 
}) => {
  const [openedDetails, setOpenedDetails] = useState<Record<string, boolean>>({});
  
  // Hook de stabilisation pour éviter les mises à jour inutiles
  const stableHandleStatusChange = useStableStatusChange({ handleStatusChange });
  
  const igsStatus = obligationStatuses.igs as IgsObligationStatus;
  
  // Références pour éviter les re-renders inutiles
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const lastCalculationRef = useRef<any>(null);
  
  // État local pour les inputs formatés (avec debouncing)
  const [localQuarterlyPayments, setLocalQuarterlyPayments] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: ''
  });
  
  const [localQuarterlyDates, setLocalQuarterlyDates] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: ''
  });

  // Initialisation une seule fois des valeurs locales
  useEffect(() => {
    if (igsStatus) {
      setLocalQuarterlyPayments({
        q1: formatNumberWithSpaces(String(igsStatus.q1Montant || '')),
        q2: formatNumberWithSpaces(String(igsStatus.q2Montant || '')),
        q3: formatNumberWithSpaces(String(igsStatus.q3Montant || '')),
        q4: formatNumberWithSpaces(String(igsStatus.q4Montant || ''))
      });
      
      setLocalQuarterlyDates({
        q1: igsStatus.q1Date || '',
        q2: igsStatus.q2Date || '',
        q3: igsStatus.q3Date || '',
        q4: igsStatus.q4Date || ''
      });
    }
  }, [igsStatus?.q1Montant, igsStatus?.q2Montant, igsStatus?.q3Montant, igsStatus?.q4Montant, igsStatus?.q1Date, igsStatus?.q2Date, igsStatus?.q3Date, igsStatus?.q4Date]);

  // Calcul centralisé et stable de l'IGS avec tous les totaux
  const igsCalculation = useMemo(() => {
    if (!igsStatus?.caValue) {
      return {
        classe: '-',
        montantAnnuel: 0,
        outOfRange: false,
        q1Amount: 0,
        q2Amount: 0,
        q3Amount: 0,
        q4Amount: 0,
        montantTotalPaye: 0,
        soldeRestant: 0
      };
    }
    
    const caNum = parseFormattedNumber(igsStatus.caValue);
    if (caNum === 0) {
      return {
        classe: '-',
        montantAnnuel: 0,
        outOfRange: false,
        q1Amount: 0,
        q2Amount: 0,
        q3Amount: 0,
        q4Amount: 0,
        montantTotalPaye: 0,
        soldeRestant: 0
      };
    }
    
    const calculation = calculateIGS(caNum, igsStatus.isCGA || false);
    
    // Calcul des montants trimestriels
    const q1Amount = parseFormattedNumber(localQuarterlyPayments.q1);
    const q2Amount = parseFormattedNumber(localQuarterlyPayments.q2);
    const q3Amount = parseFormattedNumber(localQuarterlyPayments.q3);
    const q4Amount = parseFormattedNumber(localQuarterlyPayments.q4);
    
    const montantTotalPaye = q1Amount + q2Amount + q3Amount + q4Amount;
    const soldeRestant = Math.max(0, calculation.amount - montantTotalPaye);
    
    return {
      classe: calculation.class,
      montantAnnuel: calculation.amount,
      outOfRange: calculation.outOfRange,
      q1Amount,
      q2Amount,
      q3Amount,
      q4Amount,
      montantTotalPaye,
      soldeRestant
    };
  }, [igsStatus?.caValue, igsStatus?.isCGA, localQuarterlyPayments]);

  // Mise à jour groupée et différée du state global
  useEffect(() => {
    if (!igsStatus) return;
    
    const currentCalculation = igsCalculation;
    
    // Éviter les mises à jour identiques
    if (JSON.stringify(lastCalculationRef.current) === JSON.stringify(currentCalculation)) {
      return;
    }
    
    lastCalculationRef.current = currentCalculation;
    
    // Debounce pour éviter les mises à jour trop fréquentes
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      // Mise à jour groupée de tous les champs IGS
      const updates = [
        { field: 'classe', value: currentCalculation.classe },
        { field: 'montantAnnuel', value: currentCalculation.montantAnnuel },
        { field: 'outOfRange', value: currentCalculation.outOfRange },
        { field: 'q1Montant', value: currentCalculation.q1Amount },
        { field: 'q2Montant', value: currentCalculation.q2Amount },
        { field: 'q3Montant', value: currentCalculation.q3Amount },
        { field: 'q4Montant', value: currentCalculation.q4Amount },
        { field: 'montantTotalPaye', value: currentCalculation.montantTotalPaye },
        { field: 'soldeRestant', value: currentCalculation.soldeRestant }
      ];
      
      updates.forEach(({ field, value }) => {
        stableHandleStatusChange('igs', field, value);
      });
    }, 100); // Debounce de 100ms
    
  }, [igsCalculation, igsStatus, stableHandleStatusChange]);

  // Mise à jour des dates avec debouncing
  useEffect(() => {
    if (!igsStatus) return;
    
    const dateUpdates = [
      { field: 'q1Date', value: localQuarterlyDates.q1 },
      { field: 'q2Date', value: localQuarterlyDates.q2 },
      { field: 'q3Date', value: localQuarterlyDates.q3 },
      { field: 'q4Date', value: localQuarterlyDates.q4 }
    ];
    
    dateUpdates.forEach(({ field, value }) => {
      stableHandleStatusChange('igs', field, value);
    });
  }, [localQuarterlyDates, igsStatus, stableHandleStatusChange]);

  const toggleDetails = useCallback((taxType: string) => {
    setOpenedDetails(prev => ({ ...prev, [taxType]: !prev[taxType] }));
  }, []);

  const handleCAInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    stableHandleStatusChange('igs', 'caValue', formatNumberWithSpaces(e.target.value));
  }, [stableHandleStatusChange]);

  const handleCGAInputChange = useCallback((checked: boolean) => {
    stableHandleStatusChange('igs', 'isCGA', checked);
  }, [stableHandleStatusChange]);

  const handleLocalQuarterlyPaymentChange = useCallback((quarter: string, value: string) => {
    setLocalQuarterlyPayments(prev => ({ ...prev, [quarter]: formatNumberWithSpaces(value) }));
  }, []);

  const handleLocalQuarterlyDateChange = useCallback((quarter: string, value: string) => {
    setLocalQuarterlyDates(prev => ({ ...prev, [quarter]: value }));
  }, []);
  
  const taxItems: { key: ObligationType; name: string }[] = [
    { key: 'igs', name: 'Impôt Général Synthétique (IGS)' },
    { key: 'patente', name: 'Patente' },
    { key: 'bailCommercial', name: 'Bail Commercial' },
    { key: 'tpf', name: 'Taxe sur la propriété (TPF)' },
  ];

  // Nettoyage du timeout à la destruction
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Impôts directs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {taxItems.map(item => {
          const obligation = obligationStatuses[item.key];
          if (!obligation || typeof obligation.assujetti === 'undefined') return null;

          // Type guard pour vérifier si c'est une TaxObligationStatus
          const isTaxObligation = (obs: typeof obligation): obs is TaxObligationStatus => {
            return 'payee' in obs;
          };

          if (!isTaxObligation(obligation)) return null;

          let igsSpecifics;
          if (item.key === 'igs' && igsStatus) {
            igsSpecifics = {
              caValue: igsStatus.caValue || '',
              isCGA: igsStatus.isCGA || false,
              onCAChange: handleCAInputChange,
              onCGAChange: handleCGAInputChange,
              quarterlyPayments: localQuarterlyPayments,
              quarterlyDates: localQuarterlyDates,
              onQuarterlyPaymentChange: handleLocalQuarterlyPaymentChange,
              onQuarterlyDateChange: handleLocalQuarterlyDateChange,
              currentIgsStatusForDisplay: {
                ...igsStatus,
                ...igsCalculation // Utiliser les valeurs calculées stables
              },
            };
          }

          return (
            <DirectTaxItemRenderer
              key={item.key}
              taxKey={item.key}
              taxName={item.name}
              obligation={obligation}
              isDetailsOpened={openedDetails[item.key] || false}
              onToggleDetails={() => toggleDetails(item.key)}
              handleStatusChange={stableHandleStatusChange}
              igsSpecificProps={igsSpecifics}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};
