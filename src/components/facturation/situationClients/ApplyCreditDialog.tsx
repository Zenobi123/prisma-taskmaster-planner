
import { useState } from "react";
import { ClientPayment } from "@/types/clientFinancial";
import { formatMontant } from "@/utils/formatUtils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ApplyCreditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableCredits: ClientPayment[];
  selectedInvoiceId: string | null;
  onApplyCredit: (creditId: string) => Promise<void>;
}

const ApplyCreditDialog = ({
  isOpen,
  onOpenChange,
  availableCredits,
  selectedInvoiceId,
  onApplyCredit
}: ApplyCreditDialogProps) => {
  const [selectedCreditId, setSelectedCreditId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      return format(
        typeof dateString === 'string' && dateString.includes('-') 
          ? parseISO(dateString) 
          : new Date(dateString), 
        'dd/MM/yyyy', 
        { locale: fr }
      );
    } catch (error) {
      return dateString;
    }
  };

  const handleApplyCredit = async () => {
    if (!selectedCreditId) return;
    await onApplyCredit(selectedCreditId);
    setSelectedCreditId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appliquer une avance à la facture</DialogTitle>
          <DialogDescription>
            Sélectionnez un paiement en avance à appliquer à cette facture.
          </DialogDescription>
        </DialogHeader>
        
        {availableCredits.length > 0 ? (
          <>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Avances disponibles</h4>
              <Select onValueChange={(value) => setSelectedCreditId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une avance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {availableCredits.map((credit) => (
                      <SelectItem key={credit.id} value={credit.id}>
                        {credit.reference} - {formatMontant(credit.montant)} ({formatDate(credit.date)})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button onClick={handleApplyCredit} disabled={!selectedCreditId}>
                Appliquer l'avance
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-4">
            <Alert>
              <AlertDescription>
                Aucune avance disponible pour ce client.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplyCreditDialog;
