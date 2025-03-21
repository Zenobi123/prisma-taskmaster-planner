
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Download, Edit, Eye, Trash } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Facture } from "@/types/facture";
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
}

const FactureTableRow = ({ 
  facture, 
  formatMontant, 
  onViewFacture, 
  onDownloadFacture,
  onDeleteFacture
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
      <TableCell className="font-medium">{formatMontant(facture.montant)}</TableCell>
      <TableCell><StatusBadge status={facture.status} /></TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50" 
            onClick={() => onViewFacture(facture)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-green-500 hover:text-green-700 hover:bg-green-50" 
            onClick={() => onDownloadFacture(facture)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-amber-500 hover:text-amber-700 hover:bg-amber-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-4 w-4" />
              </Button>
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
        </div>
      </TableCell>
    </TableRow>
  );
};

export default FactureTableRow;
