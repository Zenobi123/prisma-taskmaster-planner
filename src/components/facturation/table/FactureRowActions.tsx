
import { Button } from "@/components/ui/button";
import { Facture } from "@/types/facture";
import { Download, Eye, Pencil, Printer, Trash2 } from "lucide-react";

interface FactureRowActionsProps {
  facture: Facture;
  onViewDetails: (facture: Facture) => void;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onEditInvoice: (facture: Facture) => void;
  onDeleteInvoice: (factureId: string) => void;
  isAdmin?: boolean;
}

export const FactureRowActions = ({
  facture,
  onViewDetails,
  onEditInvoice,
  onDeleteInvoice,
  onPrintInvoice,
  onDownloadInvoice,
  isAdmin = false,
}: FactureRowActionsProps) => {
  // Si l'utilisateur est admin, il peut supprimer n'importe quelle facture
  // Sinon, il ne peut supprimer que les factures en attente
  const canDelete = isAdmin || facture.status === 'en_attente';
  
  return (
    <div className="flex justify-end items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onViewDetails(facture)}
        className="opacity-70 group-hover:opacity-100 transition-all duration-300"
        title="Voir les détails"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEditInvoice(facture)}
        className="opacity-70 group-hover:opacity-100 transition-all duration-300"
        title="Modifier"
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => canDelete ? onDeleteInvoice(facture.id) : undefined}
        className={`opacity-70 group-hover:opacity-100 transition-all duration-300 ${
          !canDelete 
            ? 'opacity-30 cursor-not-allowed hover:bg-transparent hover:text-inherit' 
            : 'text-red-500 hover:text-red-700 hover:bg-red-50'
        }`}
        disabled={!canDelete}
        title={canDelete ? "Supprimer" : "Seul l'administrateur peut supprimer cette facture"}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPrintInvoice(facture.id)}
        className="opacity-70 group-hover:opacity-100 transition-all duration-300 hidden sm:flex"
        title="Imprimer"
      >
        <Printer className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDownloadInvoice(facture.id)}
        className="opacity-70 group-hover:opacity-100 transition-all duration-300 hidden sm:flex"
        title="Télécharger"
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
};
