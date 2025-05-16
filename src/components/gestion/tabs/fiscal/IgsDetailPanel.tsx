
import React from 'react';
import { TaxObligationStatus } from '@/hooks/fiscal/types';
import { Card, CardContent } from '@/components/ui/card';
import { QuarterlyPaymentsSection } from './components/QuarterlyPaymentsSection';

export interface IgsDetailPanelProps {
  igsStatus: TaxObligationStatus;
  onStatusChange: (field: string, value: any) => void;
  showPanel: boolean;
  onTogglePanel: () => void;
}

export const IgsDetailPanel = ({ 
  igsStatus, 
  onStatusChange,
  showPanel,
  onTogglePanel
}: IgsDetailPanelProps) => {
  // Initialiser les variables d'état pour l'IGS
  const annualAmount = igsStatus.annualAmount || 0;
  const quarterlyAmount = Math.ceil(annualAmount / 4);
  const paiementsTrimestriels = igsStatus.paiementsTrimestriels || {};
  
  // Total des trimestres payés
  const totalPaidQuarters = Object.values(paiementsTrimestriels).filter(
    quarter => quarter && quarter.isPaid === true
  ).length;
  
  // Total des trimestres dus
  const totalDueQuarters = 4; // 4 trimestres par an
  
  // Calculer combien de trimestres devraient être payés à cette date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() est 0-indexé
  const currentYear = currentDate.getFullYear().toString();
  const selectedYear = Number(currentYear);
  
  // Si l'année sélectionnée est antérieure à l'année en cours, tous les trimestres sont dus
  // Si l'année sélectionnée est l'année en cours, calculer en fonction du mois actuel
  let expectedQuartersPaid = 0;
  
  if (selectedYear < currentYear) {
    expectedQuartersPaid = 4; // Tous les trimestres sont attendus
  } else if (selectedYear === currentYear) {
    if (currentMonth >= 10) expectedQuartersPaid = 4; // T4 attendu en octobre
    else if (currentMonth >= 7) expectedQuartersPaid = 3; // T3 attendu en juillet
    else if (currentMonth >= 4) expectedQuartersPaid = 2; // T2 attendu en avril
    else if (currentMonth >= 1) expectedQuartersPaid = 1; // T1 attendu en janvier
  }
  
  // Déterminer si le paiement est en retard
  const isLate = igsStatus.assujetti && totalPaidQuarters < expectedQuartersPaid;
  
  // Mettre à jour un paiement trimestriel
  const handleQuarterlyPaymentUpdate = (trimester: string, field: string, value: any) => {
    // Cloner l'objet pour éviter la mutation directe
    const updatedPayments = { 
      ...paiementsTrimestriels,
      [trimester]: {
        ...(paiementsTrimestriels[trimester] || {}),
        [field]: value
      }
    };
    
    onStatusChange('paiementsTrimestriels', updatedPayments);
    
    // Mettre à jour automatiquement le statut global de paiement si tous les trimestres sont payés
    const allPaid = Object.values(updatedPayments).every(
      payment => payment && payment.isPaid === true
    );
    
    if (allPaid) {
      onStatusChange('paye', true);
    }
  };
  
  return (
    <Card className="mt-4 border-dashed">
      <CardContent className="pt-6 space-y-4">
        <QuarterlyPaymentsSection
          paiementsTrimestriels={paiementsTrimestriels}
          totalPaidQuarters={totalPaidQuarters}
          totalDueQuarters={totalDueQuarters}
          expectedQuartersPaid={expectedQuartersPaid}
          isLate={isLate}
          quarterlyAmount={quarterlyAmount}
          isAssujetti={igsStatus.assujetti}
          onQuarterlyPaymentUpdate={handleQuarterlyPaymentUpdate}
        />
      </CardContent>
    </Card>
  );
};
