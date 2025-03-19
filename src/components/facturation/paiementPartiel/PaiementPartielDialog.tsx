
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facture, Paiement } from "@/types/facture";
import { PrestationsSelectionList } from "./PrestationsSelectionList";
import { PaiementFormControls } from "./PaiementFormControls";

interface PaiementPartielDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  facture: Facture | null;
  formatMontant: (montant: number) => string;
  onConfirmPaiement: (factureId: string, paiement: Paiement, prestationsIds: string[]) => Promise<Facture | null>;
}

export const PaiementPartielDialog = ({
  isOpen,
  onOpenChange,
  facture,
  formatMontant,
  onConfirmPaiement
}: PaiementPartielDialogProps) => {
  const [selectedPrestations, setSelectedPrestations] = useState<string[]>([]);
  const [montantPaiement, setMontantPaiement] = useState<number>(0);
  const [moyenPaiement, setMoyenPaiement] = useState<'especes' | 'orange_money' | 'mtn_mobile' | 'virement'>('especes');
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && facture) {
      setSelectedPrestations([]);
      setMontantPaiement(0);
      setMoyenPaiement('especes');
      setNotes("");
    }
  }, [isOpen, facture]);

  useEffect(() => {
    if (!facture) return;
    
    // For simple prestations without IDs, use the index as identifier
    const montant = facture.prestations
      .filter((_, index) => selectedPrestations.includes(index.toString()))
      .reduce((sum, p) => sum + p.montant, 0);
    
    setMontantPaiement(montant);
  }, [selectedPrestations, facture]);

  const handleTogglePrestation = (prestationIndex: string) => {
    if (!prestationIndex) return;
    
    setSelectedPrestations(prev => {
      if (prev.includes(prestationIndex)) {
        return prev.filter(id => id !== prestationIndex);
      } else {
        return [...prev, prestationIndex];
      }
    });
  };

  const handleSubmit = async () => {
    if (!facture || montantPaiement <= 0) return;
    
    setLoading(true);
    
    const paiement: Paiement = {
      date: new Date().toISOString().split('T')[0],
      montant: montantPaiement,
      mode: moyenPaiement,
      notes: notes || undefined
    };
    
    try {
      await onConfirmPaiement(facture.id, paiement, selectedPrestations);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!facture) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Paiement partiel</DialogTitle>
          <DialogDescription>
            Facture {facture.id} - {facture.client_nom} - Restant à payer: {formatMontant((facture.montant || 0) - (facture.montant_paye || 0))}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <PrestationsSelectionList 
            prestations={facture.prestations}
            selectedPrestations={selectedPrestations}
            onTogglePrestation={handleTogglePrestation}
            formatMontant={formatMontant}
          />

          <PaiementFormControls 
            montantPaiement={montantPaiement}
            moyenPaiement={moyenPaiement}
            notes={notes}
            setMontantPaiement={setMontantPaiement}
            setMoyenPaiement={setMoyenPaiement}
            setNotes={setNotes}
            isReadOnly={selectedPrestations.length > 0}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={montantPaiement <= 0 || loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer le paiement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
