
import { Facture } from "@/types/facture";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Download, 
  Printer,
  Trash2,
  CreditCard
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadFacturePDF, printFacturePDF } from "@/utils/pdfUtils";

interface FactureActionsProps {
  facture: Facture;
  onDeleteInvoice: (id: string) => void;
  onPaiementClick: (facture: Facture) => void;
}

export const FactureActions = ({ facture, onDeleteInvoice, onPaiementClick }: FactureActionsProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate(`/facturation/${facture.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        
        {facture.status !== "paye" && (
          <>
            <DropdownMenuItem onClick={() => navigate(`/facturation/${facture.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onPaiementClick(facture)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Enregistrer un paiement
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => printFacturePDF(facture)}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimer
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => downloadFacturePDF(facture)}>
          <Download className="mr-2 h-4 w-4" />
          Télécharger PDF
        </DropdownMenuItem>
        
        {facture.status !== "paye" && (
          <>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="text-destructive" 
              onClick={() => onDeleteInvoice(facture.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
