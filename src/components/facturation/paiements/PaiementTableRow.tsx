
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Trash, CreditCard, MoreHorizontal } from "lucide-react";
import { Paiement } from "@/types/paiement";
import ModePaiementBadge from "./ModePaiementBadge";
import { formatMontant } from "@/utils/formatUtils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import useFactureViewActions from "@/hooks/facturation/factureActions/useFactureViewActions";

interface PaiementTableRowProps {
  paiement: Paiement;
  onDelete?: (id: string) => Promise<boolean>;
  onViewReceipt?: (paiement: Paiement) => void;
}

const PaiementTableRow = ({ paiement, onDelete, onViewReceipt }: PaiementTableRowProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { handleVoirRecu } = useFactureViewActions();

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
        'dd/MM/yyyy', 
        { locale: fr }
      );
    } catch (error) {
      return dateString;
    }
  };

  const handleViewDetails = () => {
    console.log("Viewing details for payment:", paiement.id);
    // This would typically open a modal or navigate to a details page
    alert(`Détails du paiement ${paiement.reference}
    - Montant: ${formatMontant(paiement.montant)}
    - Mode: ${paiement.mode}
    - Date: ${formatDate(paiement.date)}
    - Client: ${paiement.client}
    - Référence: ${paiement.reference}
    ${paiement.notes ? `- Notes: ${paiement.notes}` : ''}
    `);
  };

  const handleViewReceipt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("View receipt clicked for payment:", paiement.id);
    
    if (onViewReceipt) {
      onViewReceipt(paiement);
    } else {
      // Use the fallback view receipt handler
      handleVoirRecu(paiement);
    }
  };

  // Déterminer le style du montant en fonction du montant et type de paiement
  const getMontantStyle = () => {
    if (paiement.est_credit) {
      return "font-medium text-blue-600";
    }
    if (paiement.type_paiement === "partiel") {
      return "font-medium text-amber-600";
    }
    return "font-medium text-green-600";
  };

  // Déterminer le style de la référence facture
  const getFactureStyle = () => {
    if (paiement.est_credit) {
      return "flex items-center";
    }
    return "";
  };

  return (
    <>
      <TableRow key={paiement.id} className="hover:bg-gray-50">
        <TableCell className="font-medium">{paiement.reference}</TableCell>
        <TableCell className={getFactureStyle()}>
          {paiement.facture || (
            paiement.est_credit ? (
              <Badge className="bg-blue-500">Crédit</Badge>
            ) : "N/A"
          )}
        </TableCell>
        <TableCell>{paiement.client}</TableCell>
        <TableCell>{formatDate(paiement.date)}</TableCell>
        <TableCell className={getMontantStyle()}>
          {formatMontant(paiement.montant)}
        </TableCell>
        <TableCell>
          <ModePaiementBadge mode={paiement.mode} />
        </TableCell>
        <TableCell className={paiement.solde_restant > 0 ? "font-medium text-red-500" : "text-gray-500"}>
          {formatMontant(paiement.solde_restant)}
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-56 bg-white">
              <DropdownMenuItem 
                onClick={handleViewReceipt}
                className="cursor-pointer flex items-center hover:bg-gray-100"
              >
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                Voir le reçu
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleViewDetails}
                className="cursor-pointer flex items-center hover:bg-gray-100"
              >
                <Eye className="h-4 w-4 mr-2 text-gray-500" />
                Détails
              </DropdownMenuItem>
              {paiement.est_credit && (
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center hover:bg-gray-100"
                >
                  <CreditCard className="h-4 w-4 mr-2 text-green-500" />
                  Associer à une facture
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  className="text-red-500 cursor-pointer flex items-center hover:bg-gray-100"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
