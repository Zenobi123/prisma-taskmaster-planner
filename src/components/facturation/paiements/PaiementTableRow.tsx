
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Trash, CreditCard, MoreHorizontal, CheckCircle, Clock } from "lucide-react";
import { Paiement } from "@/types/paiement";
import ModePaiementBadge from "./ModePaiementBadge";
import { formatMontant } from "@/utils/formatUtils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PaiementDetailsDialog from "./PaiementDetailsDialog";

interface PaiementTableRowProps {
  paiement: Paiement;
  onDelete?: (id: string) => Promise<boolean>;
  onViewReceipt: (paiement: Paiement) => void;
}

const PaiementTableRow = ({ paiement, onDelete, onViewReceipt }: PaiementTableRowProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
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
        'dd/MM/yyyy', 
        { locale: fr }
      );
    } catch (error) {
      return dateString;
    }
  };

  const handleViewDetails = () => {
    setDetailsDialogOpen(true);
  };

  const handleViewReceipt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("View receipt clicked for payment:", paiement.id);
    onViewReceipt(paiement);
  };

  // Determine payment type badge
  const getPaymentTypeBadge = () => {
    if (paiement.est_credit) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Avance</Badge>;
    }
    if (paiement.type_paiement === "partiel") {
      return <Badge variant="outline" className="text-orange-600 border-orange-300">Partiel</Badge>;
    }
    return <Badge variant="outline" className="text-green-600 border-green-300">Total</Badge>;
  };

  // Determine verification status
  const getVerificationIcon = () => {
    if (paiement.est_verifie) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <TooltipProvider>
      <TableRow key={paiement.id} className="hover:bg-gray-50">
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <span>{paiement.reference}</span>
            <Tooltip>
              <TooltipTrigger>
                {getVerificationIcon()}
              </TooltipTrigger>
              <TooltipContent>
                {paiement.est_verifie ? "Paiement vérifié" : "En attente de vérification"}
              </TooltipContent>
            </Tooltip>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <span>{paiement.facture || (paiement.est_credit ? "Crédit" : "N/A")}</span>
            {getPaymentTypeBadge()}
          </div>
        </TableCell>
        <TableCell>
          <div className="font-medium">{paiement.client}</div>
        </TableCell>
        <TableCell>{formatDate(paiement.date)}</TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{formatMontant(paiement.montant)}</span>
            {paiement.reference_transaction && (
              <span className="text-xs text-gray-500">Réf: {paiement.reference_transaction}</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <ModePaiementBadge mode={paiement.mode} />
        </TableCell>
        <TableCell>
          <div className={`font-medium ${paiement.solde_restant > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatMontant(paiement.solde_restant)}
          </div>
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
                <FileText className="h-4 w-4 mr-2" />
                Voir le reçu
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleViewDetails}
                className="cursor-pointer flex items-center hover:bg-gray-100"
              >
                <Eye className="h-4 w-4 mr-2" />
                Détails complets
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {paiement.est_credit && (
                <>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center hover:bg-gray-100"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Associer à une facture
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
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

      <PaiementDetailsDialog
        paiement={paiement}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

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
    </TooltipProvider>
  );
};

export default PaiementTableRow;
