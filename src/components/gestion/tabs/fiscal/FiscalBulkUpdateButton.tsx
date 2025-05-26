
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ObligationStatuses } from '@/hooks/fiscal/types';

export interface FiscalBulkUpdateButtonProps {
  obligationStatuses: ObligationStatuses;
  onStatusChange: (obligation: string, field: string, value: string | number | boolean) => void;
  isDeclarationObligation: (obligation: string) => boolean;
}

export function FiscalBulkUpdateButton({ 
  obligationStatuses, 
  onStatusChange, 
  isDeclarationObligation 
}: FiscalBulkUpdateButtonProps) {
  // Mark all obligations as assujetti
  const markAllAssujetti = () => {
    Object.keys(obligationStatuses).forEach((obligation) => {
      onStatusChange(obligation, "assujetti", true);
    });
  };

  // Mark all obligations as non assujetti
  const markAllNonAssujetti = () => {
    Object.keys(obligationStatuses).forEach((obligation) => {
      onStatusChange(obligation, "assujetti", false);
    });
  };

  // Mark all obligations as handled (paid or filed)
  const markAllHandled = () => {
    Object.keys(obligationStatuses).forEach((obligation) => {
      if (obligationStatuses[obligation as keyof ObligationStatuses]?.assujetti) {
        if (isDeclarationObligation(obligation)) {
          onStatusChange(obligation, "depose", true);
        } else {
          onStatusChange(obligation, "paye", true);
        }
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Actions groupées
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={markAllAssujetti}>
          Tout marquer comme assujetti
        </DropdownMenuItem>
        <DropdownMenuItem onClick={markAllNonAssujetti}>
          Tout marquer comme non assujetti
        </DropdownMenuItem>
        <DropdownMenuItem onClick={markAllHandled}>
          Tout marquer comme traité
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
