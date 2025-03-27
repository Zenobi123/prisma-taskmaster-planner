
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, X, Eye } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import { Paiement } from "@/types/paiement";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import useFactureViewActions from "@/hooks/facturation/factureActions/useFactureViewActions";

interface PaymentReceiptDialogProps {
  paiement: Paiement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentReceiptDialog = ({ paiement, open, onOpenChange }: PaymentReceiptDialogProps) => {
  const { handleTelechargerRecu, handleVoirRecu } = useFactureViewActions();
  
  if (!paiement) return null;
  
  // Format the date nicely
  const formatDate = (dateString: string) => {
    try {
      return format(
        typeof dateString === 'string' && dateString.includes('-') 
          ? parseISO(dateString) 
          : new Date(dateString), 
        'dd MMMM yyyy', 
        { locale: fr }
      );
    } catch (error) {
      return dateString;
    }
  };
  
  // Print the receipt
  const handlePrintReceipt = () => {
    window.print();
  };
  
  // Handle download receipt
  const handleDownloadReceipt = () => {
    handleTelechargerRecu(paiement);
  };
  
  // Handle view receipt in a new tab
  const handleViewReceipt = () => {
    handleVoirRecu(paiement);
  };
  
  // Safe reference display
  const reference = paiement.reference || paiement.id;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Reçu de paiement</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 border rounded-md p-6 bg-white">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">REÇU DE PAIEMENT</h2>
            <p className="text-gray-500">
              <span className="font-semibold">N° {reference}</span>
            </p>
          </div>
          
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">Client</h3>
              <p className="text-gray-600">{typeof paiement.client === 'object' ? paiement.client.nom : paiement.client}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-800">Date</h3>
              <p className="text-gray-600">{formatDate(paiement.date)}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700">Méthode de paiement</span>
              <span className="text-gray-600">{paiement.mode}</span>
            </div>
            {paiement.reference_transaction && (
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Référence transaction</span>
                <span className="text-gray-600">{paiement.reference_transaction}</span>
              </div>
            )}
            {paiement.facture && (
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Facture associée</span>
                <span className="text-gray-600">{paiement.facture}</span>
              </div>
            )}
            {paiement.est_credit && (
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Type</span>
                <span className="text-gray-600">Crédit (Avance)</span>
              </div>
            )}
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Montant payé</span>
              <span className="text-xl font-bold text-[#3C6255]">
                {formatMontant(paiement.montant)}
              </span>
            </div>
          </div>
          
          {paiement.notes && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">Notes</h3>
              <p className="text-gray-600 bg-gray-50 p-2 rounded">{paiement.notes}</p>
            </div>
          )}
          
          <div className="text-center text-sm text-gray-500 mt-6">
            Ce reçu confirme le traitement de votre paiement.
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="gap-2"
          >
            <X className="h-4 w-4" /> Fermer
          </Button>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrintReceipt}
              className="gap-2"
            >
              <Printer className="h-4 w-4" /> Imprimer
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleViewReceipt}
              className="gap-2"
            >
              <Eye className="h-4 w-4" /> Aperçu
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleDownloadReceipt}
              className="gap-2 bg-[#3C6255] hover:bg-[#2B4B3E]"
            >
              <Download className="h-4 w-4" /> Télécharger
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentReceiptDialog;
