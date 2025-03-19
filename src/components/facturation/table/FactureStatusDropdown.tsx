
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface FactureStatusDropdownProps {
  status: string;
  factureId: string;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => void;
}

export const FactureStatusDropdown = ({
  status,
  factureId,
  onUpdateStatus,
}: FactureStatusDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 p-0 flex items-center gap-1">
          <StatusBadge status={status} />
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => onUpdateStatus(factureId, 'en_attente')}
          className={status === 'en_attente' ? 'bg-accent text-accent-foreground' : ''}
        >
          En attente
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdateStatus(factureId, 'envoyée')}
          className={status === 'envoyée' ? 'bg-accent text-accent-foreground' : ''}
        >
          Envoyée
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdateStatus(factureId, 'payée')}
          className={status === 'payée' ? 'bg-accent text-accent-foreground' : ''}
        >
          Payée
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
