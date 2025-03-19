
import { Facture } from "@/types/facture";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getStatusBadge } from "../FactureTable";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface FactureDetailsHeaderProps {
  selectedFacture: Facture;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => void;
}

export const FactureDetailsHeader = ({
  selectedFacture,
  onPrintInvoice,
  onDownloadInvoice,
  onUpdateStatus,
}: FactureDetailsHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center justify-between">
        <span className="flex items-center gap-3">
          Facture {selectedFacture.id}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 p-0 flex items-center gap-1">
                {getStatusBadge(selectedFacture.status)}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[160px]">
              <DropdownMenuItem 
                onClick={() => onUpdateStatus(selectedFacture.id, 'en_attente')}
                className={selectedFacture.status === 'en_attente' ? 'bg-accent text-accent-foreground' : ''}
              >
                En attente
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onUpdateStatus(selectedFacture.id, 'envoyée')}
                className={selectedFacture.status === 'envoyée' ? 'bg-accent text-accent-foreground' : ''}
              >
                Envoyée
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onUpdateStatus(selectedFacture.id, 'payée')}
                className={selectedFacture.status === 'payée' ? 'bg-accent text-accent-foreground' : ''}
              >
                Payée
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPrintInvoice(selectedFacture.id)}
            className="h-8 w-8 transition-transform hover:scale-105"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDownloadInvoice(selectedFacture.id)}
            className="h-8 w-8 transition-transform hover:scale-105"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </DialogTitle>
      <DialogDescription>
        Détails de la facture du {selectedFacture.date}
      </DialogDescription>
    </DialogHeader>
  );
};
