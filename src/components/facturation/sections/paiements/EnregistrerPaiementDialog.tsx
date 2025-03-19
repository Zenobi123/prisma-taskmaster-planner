
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Facture } from "@/types/facture";
import { useState } from "react";

interface EnregistrerPaiementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFacture: Facture | null;
  formatMontant: (montant: number) => string;
  onConfirmPaiement: () => Promise<void>;
}

export const EnregistrerPaiementDialog = ({
  isOpen,
  onOpenChange,
  selectedFacture,
  formatMontant,
  onConfirmPaiement
}: EnregistrerPaiementDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("especes");

  const getMontantRestant = (facture: Facture): number => {
    return facture.montant - (facture.montantPaye || 0);
  };

  if (!selectedFacture) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Facture {selectedFacture.id} - {formatMontant(getMontantRestant(selectedFacture))}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Client
            </Label>
            <div id="client" className="col-span-3 font-medium">
              {selectedFacture.client.nom}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="method" className="text-right">
              Moyen de paiement
            </Label>
            <Select defaultValue="especes" value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="method" className="col-span-3">
                <SelectValue placeholder="Sélectionner un moyen de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="especes">Espèces</SelectItem>
                <SelectItem value="orange_money">Orange Money</SelectItem>
                <SelectItem value="mtn_mobile">MTN Mobile Money</SelectItem>
                <SelectItem value="virement">Virement bancaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onConfirmPaiement}>
            Confirmer le paiement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
