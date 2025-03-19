
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Pencil, Printer, Trash2 } from "lucide-react";
import { Facture } from "@/types/facture";
import { StatusBadge } from "../table/StatusBadge";

interface FactureDetailsHeaderProps {
  selectedFacture: Facture;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onEditInvoice: (facture: Facture) => void;
  onDeleteInvoice: (factureId: string) => void;
  isAdmin?: boolean;
}

export const FactureDetailsHeader = ({
  selectedFacture,
  onPrintInvoice,
  onDownloadInvoice,
  onEditInvoice,
  onDeleteInvoice,
  isAdmin = false,
}: FactureDetailsHeaderProps) => {
  // Tous les utilisateurs peuvent maintenant supprimer n'importe quelle facture
  const canDelete = true;
  
  return (
    <DialogHeader>
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
        <div>
          <DialogTitle className="text-lg flex space-x-3 items-center">
            <span>Facture {selectedFacture.id}</span>
            <StatusBadge status={selectedFacture.status} />
          </DialogTitle>
          <DialogDescription>
            Client: {selectedFacture.client_nom}
          </DialogDescription>
        </div>
        
        <div className="flex space-x-2 flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEditInvoice(selectedFacture)}
            className="flex items-center"
          >
            <Pencil className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Modifier</span>
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPrintInvoice(selectedFacture.id)}
            className="flex items-center"
          >
            <Printer className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Imprimer</span>
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDownloadInvoice(selectedFacture.id)}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Télécharger</span>
          </Button>
          
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDeleteInvoice(selectedFacture.id)}
            className="flex items-center"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Supprimer</span>
          </Button>
        </div>
      </div>
    </DialogHeader>
  );
};
