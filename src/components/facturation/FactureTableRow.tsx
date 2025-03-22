
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
import { MoreHorizontal, Eye, Download, Edit, Trash } from "lucide-react";
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
}

const FactureTableRow = ({ 
  facture, 
  formatMontant, 
  onViewFacture, 
  onDownloadFacture,
  onDeleteFacture,
  onEditFacture
}: FactureTableRowProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDeleteFacture(facture.id);
    setIsDeleteDialogOpen(false);
  };

  // Display the formatted facture ID (FP XXXX-YYYY)
  const factureId = facture.id && typeof facture.id === 'string' ? facture.id : 'ID inconnu';

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
              Voir la facture
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDownloadFacture(facture)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Download className="h-4 w-4 text-green-500" />
              Télécharger
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onEditFacture(facture)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Edit className="h-4 w-4 text-amber-500" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default FactureTableRow;
