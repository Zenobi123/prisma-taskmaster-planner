
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Facture, Paiement, Prestation } from "@/types/facture";
import { v4 as uuidv4 } from "uuid";

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
      // Réinitialiser les valeurs
      setSelectedPrestations([]);
      setMontantPaiement(0);
      setMoyenPaiement('especes');
      setNotes("");
    }
  }, [isOpen, facture]);

  // Calculer le montant total des prestations sélectionnées
  useEffect(() => {
    if (!facture) return;
    
    const montant = facture.prestations
      .filter(p => p.id && selectedPrestations.includes(p.id))
      .reduce((sum, p) => sum + p.montant, 0);
    
    setMontantPaiement(montant);
  }, [selectedPrestations, facture]);

  const handleTogglePrestation = (prestationId: string | undefined) => {
    if (!prestationId) return;
    
    setSelectedPrestations(prev => {
      if (prev.includes(prestationId)) {
        return prev.filter(id => id !== prestationId);
      } else {
        return [...prev, prestationId];
      }
    });
  };

  const handleSubmit = async () => {
    if (!facture || montantPaiement <= 0) return;
    
    setLoading(true);
    
    const paiement: Paiement = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      montant: montantPaiement,
      moyenPaiement,
      prestationIds: selectedPrestations,
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

  const getMoyenPaiementLabel = (moyen: string): string => {
    switch (moyen) {
      case 'especes': return 'Espèces';
      case 'orange_money': return 'Orange Money';
      case 'mtn_mobile': return 'MTN Mobile Money';
      case 'virement': return 'Virement bancaire';
      default: return moyen;
    }
  };

  const isPrestaionPayee = (prestation: Prestation): boolean => {
    return !!prestation.estPaye;
  };

  if (!facture) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Paiement partiel</DialogTitle>
          <DialogDescription>
            Facture {facture.id} - {facture.client.nom} - Restant à payer: {formatMontant((facture.montant || 0) - (facture.montantPaye || 0))}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <Label className="text-base font-medium">Sélectionnez les éléments à payer</Label>
            <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto">
              {facture.prestations.map((prestation, index) => (
                <div key={prestation.id || index} className="flex items-start space-x-3 p-2 rounded bg-muted/30">
                  <Checkbox 
                    id={`prestation-${prestation.id || index}`}
                    checked={prestation.id ? selectedPrestations.includes(prestation.id) : false}
                    onCheckedChange={() => handleTogglePrestation(prestation.id)}
                    disabled={isPrestaionPayee(prestation)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <Label 
                      htmlFor={`prestation-${prestation.id || index}`}
                      className={`${isPrestaionPayee(prestation) ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {prestation.description}
                      {isPrestaionPayee(prestation) && (
                        <span className="ml-2 text-xs text-green-600 font-medium">
                          (Payé le {prestation.datePaiement})
                        </span>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {formatMontant(prestation.montant)}
                      {prestation.quantite && ` × ${prestation.quantite}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="montant">Montant à payer</Label>
              <Input 
                id="montant" 
                type="number" 
                value={montantPaiement}
                onChange={(e) => setMontantPaiement(Number(e.target.value))}
                readOnly={selectedPrestations.length > 0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moyen-paiement">Moyen de paiement</Label>
              <Select defaultValue={moyenPaiement} onValueChange={(val: any) => setMoyenPaiement(val)}>
                <SelectTrigger id="moyen-paiement">
                  <SelectValue placeholder="Sélectionnez un moyen de paiement" />
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

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Input
              id="notes"
              placeholder="Notes sur le paiement..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
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
