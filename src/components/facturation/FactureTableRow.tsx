
import { TableCell, TableRow } from "@/components/ui/table";
import StatusBadge from "./StatusBadge";
import { Facture } from "@/types/facture";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Download, Edit, Trash, Send, Ban } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface FactureTableRowProps {
  facture: Facture;
  formatMontant: (montant: number) => string;
  onViewFacture: (facture: Facture) => void;
  onDownloadFacture: (facture: Facture) => void;
  onDeleteFacture: (factureId: string) => void;
  onEditFacture: (facture: Facture) => void;
  onSendFacture?: (facture: Facture) => void;
  onCancelFacture?: (facture: Facture) => void;
  isMobile?: boolean;
}

const FactureTableRow = ({ 
  facture, 
  formatMontant, 
  onViewFacture, 
  onDownloadFacture,
  onDeleteFacture,
  onEditFacture,
  onSendFacture,
  onCancelFacture,
  isMobile
}: FactureTableRowProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDeleteFacture(facture.id);
    setIsDeleteDialogOpen(false);
  };

  // Display the formatted facture ID (FP XXXX-YYYY)
  const factureId = facture.id && typeof facture.id === 'string' ? facture.id : 'ID inconnu';
  
  // Determine if certain actions should be disabled based on facture status
  const isFactureCancelled = facture.status === 'annulée';
  const isFactureSent = facture.status === 'envoyée';
  const isFactureDraft = facture.status === 'brouillon';
  const isFacturePaid = facture.status_paiement === 'payée';
  
  // Déterminer si la facture peut être annulée ou supprimée
  // Une facture envoyée et payée ne peut pas être annulée ou supprimée
  const canCancel = !isFactureCancelled && !(isFactureSent && isFacturePaid);
  const canDelete = !(isFactureSent && isFacturePaid);

  if (isMobile) {
    return (
      <TableRow className="hover:bg-gray-50">
        <TableCell className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">{factureId}</span>
              <StatusBadge status={facture.status} type="document" />
            </div>
            <div className="text-sm text-gray-600">{facture.client.nom}</div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{facture.date}</span>
              <span className="font-medium">{formatMontant(facture.montant)}</span>
            </div>
            <div className="flex justify-between items-center">
              <StatusBadge status={facture.status_paiement} type="paiement" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Options</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* Same dropdown menu content as desktop */}
                  <DropdownMenuItem 
                    onClick={() => onViewFacture(facture)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="h-4 w-4 text-blue-500" />
                    Aperçu
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDownloadFacture(facture)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="h-4 w-4 text-green-500" />
                    Télécharger
                  </DropdownMenuItem>
                  
                  {/* Action: Envoyer (seulement pour les brouillons) */}
                  {onSendFacture && isFactureDraft && (
                    <DropdownMenuItem 
                      onClick={() => onSendFacture(facture)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="h-4 w-4 text-blue-500" />
                      Envoyer
                    </DropdownMenuItem>
                  )}
                  
                  {/* Action: Annuler (pas pour les annulées, ni les envoyées et payées) */}
                  {onCancelFacture && canCancel && (
                    <DropdownMenuItem 
                      onClick={() => onCancelFacture(facture)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Ban className="h-4 w-4 text-red-500" />
                      Annuler
                    </DropdownMenuItem>
                  )}
                  
                  {/* On ne permet d'éditer que les brouillons */}
                  {isFactureDraft && (
                    <DropdownMenuItem 
                      onClick={() => onEditFacture(facture)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Edit className="h-4 w-4 text-amber-500" />
                      Modifier
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  {/* Supprimer seulement si ce n'est pas une facture envoyée et payée */}
                  {canDelete ? (
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-red-600 cursor-pointer"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash className="h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer la facture {factureId} ?
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <DropdownMenuItem 
                      className="flex items-center gap-2 text-red-300 cursor-not-allowed opacity-50"
                      disabled
                    >
                      <Trash className="h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium text-gray-800">{factureId}</TableCell>
      <TableCell>{facture.client.nom}</TableCell>
      <TableCell>{facture.date}</TableCell>
      <TableCell>{facture.echeance}</TableCell>
      <TableCell className="font-medium">{formatMontant(facture.montant)}</TableCell>
      <TableCell>
        <StatusBadge status={facture.status} type="document" />
      </TableCell>
      <TableCell>
        <StatusBadge status={facture.status_paiement} type="paiement" />
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Options</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => onViewFacture(facture)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Eye className="h-4 w-4 text-blue-500" />
              Aperçu
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDownloadFacture(facture)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Download className="h-4 w-4 text-green-500" />
              Télécharger
            </DropdownMenuItem>
            
            {/* Action: Envoyer (seulement pour les brouillons) */}
            {onSendFacture && isFactureDraft && (
              <DropdownMenuItem 
                onClick={() => onSendFacture(facture)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Send className="h-4 w-4 text-blue-500" />
                Envoyer
              </DropdownMenuItem>
            )}
            
            {/* Action: Annuler (pas pour les annulées, ni les envoyées et payées) */}
            {onCancelFacture && canCancel && (
              <DropdownMenuItem 
                onClick={() => onCancelFacture(facture)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Ban className="h-4 w-4 text-red-500" />
                Annuler
              </DropdownMenuItem>
            )}
            
            {/* On ne permet d'éditer que les brouillons */}
            {isFactureDraft && (
              <DropdownMenuItem 
                onClick={() => onEditFacture(facture)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Edit className="h-4 w-4 text-amber-500" />
                Modifier
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {/* Supprimer seulement si ce n'est pas une facture envoyée et payée */}
            {canDelete ? (
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-red-600 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash className="h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer la facture {factureId} ?
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <DropdownMenuItem 
                className="flex items-center gap-2 text-red-300 cursor-not-allowed opacity-50"
                disabled
              >
                <Trash className="h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default FactureTableRow;
