
import { Button } from "@/components/ui/button";
import { Facture } from "@/types/facture";
import { Download, Eye, Pencil, Printer, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteFactureDialog } from "../DeleteFactureDialog";

interface FactureRowActionsProps {
  facture: Facture;
  onViewDetails: (facture: Facture) => void;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onEditInvoice: (facture: Facture) => void;
  onDeleteInvoice: (factureId: string) => void;
}

export const FactureRowActions = ({
  facture,
  onViewDetails,
  onEditInvoice,
  onDeleteInvoice,
  onPrintInvoice,
  onDownloadInvoice,
}: FactureRowActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleDelete = () => {
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    onDeleteInvoice(facture.id);
    setShowDeleteDialog(false);
  };
  
  return (
    <>
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
          onClick={handleDelete}
          className="opacity-70 group-hover:opacity-100 transition-all duration-300 text-red-500 hover:text-red-700 hover:bg-red-50"
          title="Supprimer"
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
      
      <DeleteFactureDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title={`Supprimer la facture ${facture.id}`}
        description="Êtes-vous sûr de vouloir supprimer définitivement cette facture ? Cette action est irréversible."
      />
    </>
  );
};
