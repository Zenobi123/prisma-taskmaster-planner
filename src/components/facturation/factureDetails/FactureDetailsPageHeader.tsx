
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download, CreditCard, Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/facturation/table/StatusBadge";
import { Facture } from "@/types/facture";

interface FactureDetailsPageHeaderProps {
  facture: Facture;
  onBack: () => void;
  onPrint: (facture: Facture) => void;
  onDownload: (facture: Facture) => void;
  onEdit: (id: string) => void;
  onPaymentClick: () => void;
  onDeleteClick: () => void;
}

export const FactureDetailsPageHeader = ({
  facture,
  onBack,
  onPrint,
  onDownload,
  onEdit,
  onPaymentClick,
  onDeleteClick
}: FactureDetailsPageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onBack}
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Facture {facture.id}</h1>
        <StatusBadge status={facture.status} />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPrint(facture)}
        >
          <Printer className="mr-2 h-4 w-4" />
          Imprimer
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(facture)}
        >
          <Download className="mr-2 h-4 w-4" />
          Télécharger PDF
        </Button>
        
        {facture.status !== "paye" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(facture.id)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={onPaymentClick}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Enregistrer un paiement
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteClick}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
