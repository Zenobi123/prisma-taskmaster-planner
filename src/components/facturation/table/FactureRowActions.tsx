
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
  onDeleteInvoice: (factureId: string) => Promise<boolean> | void;
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
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = () => {
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      console.log(`Suppression de la facture ${facture.id} initiée...`);
      
      const result = onDeleteInvoice(facture.id);
      
      // Handle both Promise<boolean> and void return types
      if (result instanceof Promise) {
        const success = await result;
        if (success) {
          console.log(`Suppression de la facture ${facture.id} réussie.`);
          setShowDeleteDialog(false);
        } else {
          console.error(`Échec de la suppression de la facture ${facture.id}.`);
          // Le dialogue reste ouvert en cas d'échec
        }
      } else {
        // If void is returned, just close the dialog after a short delay
        console.log(`Suppression de la facture ${facture.id} initiée (sans retour).`);
        setTimeout(() => setShowDeleteDialog(false), 500);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture:", error);
    } finally {
      setIsDeleting(false);
    }
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
          disabled={isDeleting}
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
        isDeleting={isDeleting}
      />
    </>
  );
};
