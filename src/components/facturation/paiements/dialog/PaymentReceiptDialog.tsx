
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, X, Eye } from "lucide-react";
import { Paiement } from "@/types/paiement";
import useFactureViewActions from "@/hooks/facturation/factureActions/useFactureViewActions";
import ReceiptHeader from "./receipt-components/ReceiptHeader";
import ReceiptContent from "./receipt-components/ReceiptContent";
import ReceiptFooter from "./receipt-components/ReceiptFooter";

interface PaymentReceiptDialogProps {
  paiement: Paiement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentReceiptDialog = ({ paiement, open, onOpenChange }: PaymentReceiptDialogProps) => {
  const { handleTelechargerRecu, handleVoirRecu } = useFactureViewActions();
  
  if (!paiement) return null;
  
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Reçu de paiement</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 border rounded-md p-6 bg-white">
          <ReceiptHeader paiement={paiement} />
          <ReceiptContent paiement={paiement} />
          <ReceiptFooter paiement={paiement} />
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
