
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Facture, Paiement } from "@/types/facture";

interface PaiementDialogProps {
  facture: Facture | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPaiement: (id: string, paiement: Paiement) => Promise<Facture>;
}

export const PaiementDialog = ({
  facture,
  isOpen,
  onOpenChange,
  onPaiement
}: PaiementDialogProps) => {
  const [montant, setMontant] = useState<number | "">("");
  const [mode, setMode] = useState<string>("especes");
  const [reference, setReference] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens/closes
  useState(() => {
    if (isOpen && facture) {
      // Préremplit le montant avec le reste à payer
      const restant = facture.montant - (facture.montant_paye || 0);
      setMontant(restant);
      setMode("especes");
      setReference("");
    }
  });

  const handleSubmit = async () => {
    if (!facture || !montant) return;
    
    setLoading(true);
    
    try {
      const paiement: Paiement = {
        date: new Date().toISOString().split('T')[0],
        montant: Number(montant),
        mode,
        reference: reference || undefined
      };
      
      await onPaiement(facture.id, paiement);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!facture) return null;
  
  // Calculer le reste à payer
  const montantRestant = facture.montant - (facture.montant_paye || 0);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="montant">Montant (FCFA)</Label>
            <Input
              id="montant"
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value ? Number(e.target.value) : "")}
              max={montantRestant}
              placeholder="Montant du paiement"
            />
            <p className="text-sm text-muted-foreground">
              Reste à payer: {montantRestant.toLocaleString()} FCFA
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mode">Mode de paiement</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un mode de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="especes">Espèces</SelectItem>
                <SelectItem value="cheque">Chèque</SelectItem>
                <SelectItem value="virement">Virement bancaire</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reference">Référence (Optionnel)</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Numéro de chèque, référence de virement..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!montant || Number(montant) <= 0 || Number(montant) > montantRestant || loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer le paiement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
