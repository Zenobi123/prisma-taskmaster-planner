
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Trash, CreditCard } from "lucide-react";
import { Paiement } from "@/types/paiement";
import ModePaiementBadge from "./ModePaiementBadge";
import { formatMontant } from "@/utils/formatUtils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface PaiementTableRowProps {
  paiement: Paiement;
  onDelete?: (id: string) => Promise<boolean>;
  onViewReceipt?: (paiement: Paiement) => void;
}

const PaiementTableRow = ({ paiement, onDelete, onViewReceipt }: PaiementTableRowProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(paiement.id);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(
        typeof dateString === 'string' && dateString.includes('-') 
          ? parseISO(dateString) 
          : new Date(dateString), 
        'dd MMM yyyy', 
        { locale: fr }
      );
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      <TableRow key={paiement.id}>
        <TableCell className="font-medium">{paiement.reference}</TableCell>
        <TableCell>{paiement.facture || (paiement.est_credit ? "Crédit" : "N/A")}</TableCell>
        <TableCell>{paiement.client}</TableCell>
        <TableCell>{formatDate(paiement.date)}</TableCell>
        <TableCell>{formatMontant(paiement.montant)}</TableCell>
        <TableCell>
          <ModePaiementBadge mode={paiement.mode} />
        </TableCell>
        <TableCell>{formatMontant(paiement.solde_restant)}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            {onViewReceipt && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => onViewReceipt(paiement)}
                title="Voir le reçu"
              >
                <FileText className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="outline" 
              size="icon"
              title="Détails du paiement"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {paiement.est_credit && (
              <Button 
                variant="outline" 
                size="icon"
                title="Associer à une facture"
              >
                <CreditCard className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setDeleteDialogOpen(true)}
                title="Supprimer"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera définitivement le paiement {paiement.reference}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PaiementTableRow;
