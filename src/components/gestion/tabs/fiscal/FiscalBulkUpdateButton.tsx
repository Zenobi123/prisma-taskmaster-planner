
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CheckCheck, AlertCircle } from "lucide-react";
import { ObligationStatuses } from "@/hooks/fiscal/types";

interface FiscalBulkUpdateButtonProps {
  obligationStatuses: ObligationStatuses;
  handleStatusChange: (obligation: string, field: string, value: boolean) => void;
  isDeclarationObligation: (obligation: string) => boolean;
}

export function FiscalBulkUpdateButton({
  obligationStatuses,
  handleStatusChange,
  isDeclarationObligation
}: FiscalBulkUpdateButtonProps) {
  const markAllAsAssujetti = () => {
    Object.keys(obligationStatuses).forEach((key) => {
      handleStatusChange(key, "assujetti", true);
    });
  };

  const markAllAsNotAssujetti = () => {
    Object.keys(obligationStatuses).forEach((key) => {
      handleStatusChange(key, "assujetti", false);
      
      // Also reset the completed status
      if (isDeclarationObligation(key)) {
        handleStatusChange(key, "depose", false);
      } else {
        handleStatusChange(key, "paye", false);
      }
    });
  };

  const markAllAsComplete = () => {
    Object.keys(obligationStatuses).forEach((key) => {
      const status = obligationStatuses[key];
      // Only mark as complete if they are subject to (assujetti)
      // We need to check the type to avoid TypeScript errors
      if ('assujetti' in status && status.assujetti) {
        if (isDeclarationObligation(key)) {
          handleStatusChange(key, "depose", true);
        } else {
          handleStatusChange(key, "paye", true);
        }
      }
    });
  };

  const markAllAsIncomplete = () => {
    Object.keys(obligationStatuses).forEach((key) => {
      const status = obligationStatuses[key];
      // We need to check the type to avoid TypeScript errors
      if ('assujetti' in status && status.assujetti) {
        if (isDeclarationObligation(key)) {
          handleStatusChange(key, "depose", false);
        } else {
          handleStatusChange(key, "paye", false);
        }
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Mise à jour groupée
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mise à jour groupée</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={markAllAsAssujetti}>
          <AlertCircle className="mr-2 h-4 w-4" />
          Marquer tout comme assujetti
        </DropdownMenuItem>
        <DropdownMenuItem onClick={markAllAsNotAssujetti}>
          <AlertCircle className="mr-2 h-4 w-4" />
          Marquer tout comme non assujetti
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={markAllAsComplete}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Marquer tout comme complété
        </DropdownMenuItem>
        <DropdownMenuItem onClick={markAllAsIncomplete}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Marquer tout comme incomplet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
