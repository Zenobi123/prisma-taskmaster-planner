
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Settings } from 'lucide-react';
import { ObligationStatus, ObligationStatuses } from '@/hooks/fiscal/types';

interface FiscalBulkUpdateButtonProps {
  obligationStatuses: ObligationStatuses;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  isDeclarationObligation: (obligation: string) => boolean;
}

export const FiscalBulkUpdateButton: React.FC<FiscalBulkUpdateButtonProps> = ({
  obligationStatuses,
  onStatusChange,
  isDeclarationObligation
}) => {
  const [open, setOpen] = useState(false);

  const handleBulkUpdate = (action: 'markAllAsLiable' | 'markAllAsExempt' | 'markAllAsPaid' | 'markAllAsUnpaid' | 'markAllAsSubmitted' | 'markAllAsNotSubmitted') => {
    // Récupérer toutes les clés d'obligations
    const obligationKeys = Object.keys(obligationStatuses);
    
    if (action === 'markAllAsLiable') {
      // Marquer toutes les obligations comme assujetties
      obligationKeys.forEach(key => {
        onStatusChange(key, 'assujetti', true);
      });
    } else if (action === 'markAllAsExempt') {
      // Marquer toutes les obligations comme non assujetties
      obligationKeys.forEach(key => {
        onStatusChange(key, 'assujetti', false);
      });
    } else if (action === 'markAllAsPaid') {
      // Marquer toutes les taxes comme payées (mais uniquement si assujetties)
      obligationKeys.forEach(key => {
        if (!isDeclarationObligation(key) && obligationStatuses[key]?.assujetti) {
          onStatusChange(key, 'paye', true);
        }
      });
    } else if (action === 'markAllAsUnpaid') {
      // Marquer toutes les taxes comme non payées
      obligationKeys.forEach(key => {
        if (!isDeclarationObligation(key)) {
          onStatusChange(key, 'paye', false);
        }
      });
    } else if (action === 'markAllAsSubmitted') {
      // Marquer toutes les déclarations comme déposées (mais uniquement si assujetties)
      obligationKeys.forEach(key => {
        if (isDeclarationObligation(key) && obligationStatuses[key]?.assujetti) {
          onStatusChange(key, 'depose', true);
        }
      });
    } else if (action === 'markAllAsNotSubmitted') {
      // Marquer toutes les déclarations comme non déposées
      obligationKeys.forEach(key => {
        if (isDeclarationObligation(key)) {
          onStatusChange(key, 'depose', false);
        }
      });
    }
    
    // Fermer le menu après l'action
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings size={16} />
          Actions groupées
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Actions rapides</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleBulkUpdate('markAllAsLiable')}>
          Tout marquer comme assujetti
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBulkUpdate('markAllAsExempt')}>
          Tout marquer comme non assujetti
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Taxes et Impôts</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleBulkUpdate('markAllAsPaid')}>
          Marquer toutes les taxes comme payées
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBulkUpdate('markAllAsUnpaid')}>
          Marquer toutes les taxes comme non payées
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Déclarations</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleBulkUpdate('markAllAsSubmitted')}>
          Marquer toutes les déclarations comme déposées
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBulkUpdate('markAllAsNotSubmitted')}>
          Marquer toutes les déclarations comme non déposées
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
