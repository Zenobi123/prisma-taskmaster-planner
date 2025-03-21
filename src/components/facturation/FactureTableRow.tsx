
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Download, Edit, Eye, Trash } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Facture } from "@/types/facture";
import { useState } from "react";
import UpdateFactureDialog from "./factures/UpdateFactureDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface FactureTableRowProps {
  facture: Facture;
  formatMontant: (montant: number) => string;
  onViewFacture: (facture: Facture) => void;
  onDownloadFacture: (facture: Facture) => void;
  onEditFacture?: (facture: Facture, updatedData: Partial<Facture>) => void;
  onCancelFacture?: (facture: Facture) => void;
}

const FactureTableRow = ({ 
  facture, 
  formatMontant, 
  onViewFacture, 
  onDownloadFacture,
  onEditFacture,
  onCancelFacture
}: FactureTableRowProps) => {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  
  // Check if the invoice can be edited (not fully paid)
  const canEditInvoice = facture.status !== "payée" && facture.status !== "annulée";
  
  const handleEditClick = () => {
    setUpdateDialogOpen(true);
  };
  
  const handleEditSuccess = (updatedData: Partial<Facture>) => {
    if (onEditFacture) {
      onEditFacture(facture, updatedData);
    }
    setUpdateDialogOpen(false);
  };

  const handleCancelInvoice = () => {
    if (onCancelFacture) {
      onCancelFacture(facture);
    }
  };

  return (
    <>
      <TableRow className="hover:bg-gray-50">
        <TableCell className="font-medium text-gray-800">{facture.id}</TableCell>
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
              title="Voir la facture"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-green-500 hover:text-green-700 hover:bg-green-50" 
              onClick={() => onDownloadFacture(facture)}
              title="Télécharger la facture"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            {canEditInvoice && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-amber-500 hover:text-amber-700 hover:bg-amber-50"
                  onClick={handleEditClick}
                  title="Modifier la facture"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Annuler la facture"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Annuler la facture</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir annuler cette facture ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleCancelInvoice}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Confirmer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>

      {onEditFacture && (
        <UpdateFactureDialog
          facture={facture}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};

export default FactureTableRow;
