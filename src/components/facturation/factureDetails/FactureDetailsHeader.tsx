
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
  // Si l'utilisateur est admin, il peut supprimer n'importe quelle facture
  // Sinon, il ne peut supprimer que les factures en attente
  const canDelete = isAdmin || selectedFacture.status === 'en_attente';
  
  return (
    <DialogHeader>
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
        <div>
          <DialogTitle className="text-lg flex space-x-3 items-center">
            <span>Facture {selectedFacture.id}</span>
            <StatusBadge status={selectedFacture.status} />
          </DialogTitle>
          <DialogDescription>
            Client: {selectedFacture.client.nom}
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
            variant={canDelete ? "destructive" : "outline"}
            onClick={() => canDelete ? onDeleteInvoice(selectedFacture.id) : undefined}
            className={`flex items-center ${!canDelete ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!canDelete}
            title={canDelete ? "Supprimer" : "Seul l'administrateur peut supprimer cette facture"}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Supprimer</span>
          </Button>
        </div>
      </div>
    </DialogHeader>
  );
};
