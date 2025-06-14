
import React from 'react';
import { ObligationType, TaxObligationStatus, IgsObligationStatus } from '@/hooks/fiscal/types';
import { TaxObligationItemHeader } from './shared/TaxObligationItemHeader';
import { TaxObligationDetailsWrapper } from './shared/TaxObligationDetailsWrapper';
import { IgsCaCgaInputs } from './igs/IgsCaCgaInputs';
import { IgsCalculatedDisplay } from './igs/IgsCalculatedDisplay';
import { IgsPaymentSummaryDisplay } from './igs/IgsPaymentSummaryDisplay';
import { IgsQuarterlyPaymentsTable } from './igs/IgsQuarterlyPaymentsTable';
import { GenericTaxPaymentDetailsForm } from './shared/GenericTaxPaymentDetailsForm';

interface DirectTaxItemRendererProps {
  taxKey: ObligationType;
  taxName: string;
  obligation: TaxObligationStatus; // This is obligationStatuses[taxKey]
  isDetailsOpened: boolean;
  onToggleDetails: () => void;
  handleStatusChange: (taxType: ObligationType, field: string, value: boolean | string | number) => void;
  
  // Props for IGS type
  igsSpecificProps?: {
    caValue: string;
    isCGA: boolean;
    onCAChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCGAChange: (checked: boolean) => void;
    quarterlyPayments: Record<string, string>;
    quarterlyDates: Record<string, string>;
    onQuarterlyPaymentChange: (quarter: string, value: string) => void;
    onQuarterlyDateChange: (quarter: string, value: string) => void;
    currentIgsStatusForDisplay: IgsObligationStatus; // The full IGS status object for display components
  }
}

export const DirectTaxItemRenderer: React.FC<DirectTaxItemRendererProps> = ({
  taxKey,
  taxName,
  obligation,
  isDetailsOpened,
  onToggleDetails,
  handleStatusChange,
  igsSpecificProps,
}) => {
  
  const handleAssujettiChange = (checked: boolean) => {
    handleStatusChange(taxKey, 'assujetti', checked);
    if (!checked && obligation.payee) {
      handleStatusChange(taxKey, 'payee', false);
    }
  };

  const handlePayeeChange = (checked: boolean) => {
    handleStatusChange(taxKey, 'payee', checked);
  };

  const showDetailsContent = obligation.assujetti && (obligation.payee || isDetailsOpened);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
      <TaxObligationItemHeader
        taxKey={taxKey}
        taxName={taxName}
        obligation={obligation}
        isDetailsOpened={isDetailsOpened}
        onAssujettiChange={handleAssujettiChange}
        onPayeeChange={handlePayeeChange}
        onToggleDetails={onToggleDetails}
      />

      {showDetailsContent && (
        <TaxObligationDetailsWrapper
          isDetailsOpened={isDetailsOpened}
          isPayed={obligation.payee}
          onToggleDetails={onToggleDetails}
        >
          {taxKey === 'igs' && igsSpecificProps && (
            <>
              <IgsCaCgaInputs
                caValue={igsSpecificProps.caValue}
                isCGA={igsSpecificProps.isCGA}
                onCAChange={igsSpecificProps.onCAChange}
                onCGAChange={igsSpecificProps.onCGAChange}
              />
              <IgsCalculatedDisplay igsStatus={igsSpecificProps.currentIgsStatusForDisplay} />
              <IgsPaymentSummaryDisplay igsStatus={igsSpecificProps.currentIgsStatusForDisplay} />
              <IgsQuarterlyPaymentsTable
                quarterlyPayments={igsSpecificProps.quarterlyPayments}
                quarterlyDates={igsSpecificProps.quarterlyDates}
                onPaymentChange={igsSpecificProps.onQuarterlyPaymentChange}
                onDateChange={igsSpecificProps.onQuarterlyDateChange}
              />
            </>
          )}
          {taxKey !== 'igs' && (
            <GenericTaxPaymentDetailsForm
              obligation={obligation}
              obligationKey={taxKey}
              onStatusChange={handleStatusChange}
            />
          )}
        </TaxObligationDetailsWrapper>
      )}
    </div>
  );
};

