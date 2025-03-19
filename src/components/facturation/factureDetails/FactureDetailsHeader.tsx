
import { Facture } from "@/types/facture";
import { Download, Printer, Pencil, Trash2 } from "lucide-react";
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
  onEditInvoice?: (facture: Facture) => void;
  onDeleteInvoice?: (factureId: string) => void;
}

export const FactureDetailsHeader = ({
  selectedFacture,
  onPrintInvoice,
  onDownloadInvoice,
  onUpdateStatus,
  onEditInvoice,
  onDeleteInvoice,
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
          {onEditInvoice && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEditInvoice(selectedFacture)}
              className="h-8 w-8 transition-transform hover:scale-105"
              title="Modifier"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDeleteInvoice && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDeleteInvoice(selectedFacture.id)}
              className="h-8 w-8 transition-transform hover:scale-105 text-red-500 hover:text-red-700 hover:border-red-300"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPrintInvoice(selectedFacture.id)}
            className="h-8 w-8 transition-transform hover:scale-105"
            title="Imprimer"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDownloadInvoice(selectedFacture.id)}
            className="h-8 w-8 transition-transform hover:scale-105"
            title="Télécharger"
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
