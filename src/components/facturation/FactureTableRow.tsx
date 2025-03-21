
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Download, Edit, Eye, MoreVertical, Send, Trash } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Facture } from "@/types/facture";
import { useState } from "react";
import UpdateFactureDialog from "./factures/UpdateFactureDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface FactureTableRowProps {
  facture: Facture;
  formatMontant: (montant: number) => string;
  onViewFacture: (facture: Facture) => void;
  onDownloadFacture: (facture: Facture) => void;
  onEditFacture?: (facture: Facture, updatedData: Partial<Facture>) => void;
  onCancelFacture?: (facture: Facture) => void;
  onSendFacture?: (facture: Facture) => void;
}

const FactureTableRow = ({ 
  facture, 
  formatMontant, 
  onViewFacture, 
  onDownloadFacture,
  onEditFacture,
  onCancelFacture,
  onSendFacture
}: FactureTableRowProps) => {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const { toast } = useToast();
  
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

  const handleSendInvoice = () => {
    if (onSendFacture) {
      onSendFacture(facture);
    } else {
      // Fallback if onSendFacture is not provided
      toast({
        title: "Facture envoyée",
        description: `La facture ${facture.id} a été envoyée au client.`,
      });
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
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      title="Plus d'options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={handleSendInvoice}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="h-4 w-4 text-blue-500" />
                      <span>Envoyer</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <AlertDialogTrigger className="flex items-center gap-2 cursor-pointer w-full">
                        <Trash className="h-4 w-4 text-red-500" />
                        <span>Annuler</span>
                      </AlertDialogTrigger>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <AlertDialog>
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
