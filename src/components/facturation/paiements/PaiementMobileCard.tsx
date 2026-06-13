
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Trash, CreditCard, MoreHorizontal } from "lucide-react";
import { Paiement } from "@/types/paiement";
import ModePaiementBadge from "./ModePaiementBadge";
import { formatMontant } from "@/utils/formatUtils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaiementMobileCardProps {
  paiement: Paiement;
  onDelete?: (id: string) => Promise<boolean>;
  onViewReceipt: (paiement: Paiement) => void;
}

/**
 * Variante « carte » de PaiementTableRow, affichée sur mobile pour éviter le
 * défilement horizontal d'un tableau à 8 colonnes. Reprend les mêmes actions.
 */
const PaiementMobileCard = ({ paiement, onDelete, onViewReceipt }: PaiementMobileCardProps) => {
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
        typeof dateString === "string" && dateString.includes("-")
          ? parseISO(dateString)
          : new Date(dateString),
        "dd/MM/yyyy",
        { locale: fr }
      );
    } catch (error) {
      return dateString;
    }
  };

  const handleViewDetails = () => {
    alert(`Détails du paiement ${paiement.reference}
    - Montant: ${formatMontant(paiement.montant)}
    - Mode: ${paiement.mode}
    - Date: ${formatDate(paiement.date)}
    - Client: ${paiement.client}
    - Référence: ${paiement.reference}
    ${paiement.notes ? `- Notes: ${paiement.notes}` : ""}
    `);
  };

  const clientName =
    typeof paiement.client === "string"
      ? paiement.client
      : paiement.client?.nom || paiement.client?.raisonsociale || "";

  return (
    <>
      <div className="rounded-lg border bg-white p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{paiement.reference}</div>
            <div className="text-sm text-gray-600 truncate">{clientName}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[11px] text-gray-400">Montant</div>
            <div className="font-semibold text-sm">{formatMontant(paiement.montant)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDate(paiement.date)}</span>
          <span>
            Facture : {paiement.facture || (paiement.est_credit ? "Crédit" : "N/A")}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <ModePaiementBadge mode={paiement.mode} />
            <span className="text-xs text-gray-500">
              Solde : {formatMontant(paiement.solde_restant)}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-56 bg-white">
              <DropdownMenuItem
                onClick={() => onViewReceipt(paiement)}
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
                Détails
              </DropdownMenuItem>
              {paiement.est_credit && (
                <DropdownMenuItem className="cursor-pointer flex items-center hover:bg-gray-100">
                  <CreditCard className="h-4 w-4 mr-2" />
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
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera définitivement le paiement{" "}
              {paiement.reference}.
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

export default PaiementMobileCard;
