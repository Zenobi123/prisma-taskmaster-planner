
import React, { useState } from 'react';
import { DeclarationObligationItem } from '../DeclarationObligationItem';
import { TaxObligationItem } from '../TaxObligationItem';
import { IgsDetailPanel } from '../IgsDetailPanel';
import { FiscalBulkUpdateButton } from '../FiscalBulkUpdateButton';
import { TaxObligationStatus, DeclarationObligationStatus, ObligationStatuses } from '@/hooks/fiscal/types';

interface FiscalObligationsSectionProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (obligation: string, field: string, value: any) => void;
  onBulkUpdate: () => Promise<void>;
  isUpdating: boolean;
}

export const FiscalObligationsSection: React.FC<FiscalObligationsSectionProps> = ({
  obligationStatuses,
  handleStatusChange,
  onBulkUpdate,
  isUpdating
}) => {
  const [igsDetailsOpen, setIgsDetailsOpen] = useState(false);

  const handleToggleIgsDetails = () => {
    setIgsDetailsOpen(!igsDetailsOpen);
  };

  if (!obligationStatuses) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Obligations annuelles</h3>
        <FiscalBulkUpdateButton 
          isLoading={isUpdating} 
          onUpdate={onBulkUpdate} 
        />
      </div>
      
      <div className="space-y-4 mt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2">Impôts</h4>
            <div className="space-y-3">
              <TaxObligationItem
                label="Impôt Global sur les Revenus et IGS"
                status={obligationStatuses.igs}
                obligationKey="igs"
                onChange={handleStatusChange}
                expanded={igsDetailsOpen}
                onToggleExpand={handleToggleIgsDetails}
              />
              <TaxObligationItem
                label="Patente"
                status={obligationStatuses.patente}
                obligationKey="patente"
                onChange={handleStatusChange}
              />
              <TaxObligationItem
                label="Impôts sur les Bénéfices (BAIC)"
                status={obligationStatuses.baic}
                obligationKey="baic"
                onChange={handleStatusChange}
              />
              <TaxObligationItem
                label="Impôts sur Traitements et Salaires"
                status={obligationStatuses.its}
                obligationKey="its"
                onChange={handleStatusChange}
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Déclarations</h4>
            <div className="space-y-3">
              <DeclarationObligationItem
                label="Déclaration Statistique et Fiscale (DSF)"
                status={obligationStatuses.dsf}
                obligationKey="dsf"
                onChange={handleStatusChange}
              />
              <DeclarationObligationItem
                label="DARP (Déclaration Annuelle des Retenues à la Source)"
                status={obligationStatuses.darp}
                obligationKey="darp"
                onChange={handleStatusChange}
              />
              <DeclarationObligationItem
                label="Licence"
                status={obligationStatuses.licence}
                obligationKey="licence"
                onChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
        
        {igsDetailsOpen && (
          <IgsDetailPanel 
            igsStatus={obligationStatuses.igs} 
            onUpdate={(field, value) => handleStatusChange('igs', field, value)}
          />
        )}
      </div>
    </div>
  );
};
