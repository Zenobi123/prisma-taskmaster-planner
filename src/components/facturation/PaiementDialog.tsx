
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Facture, Paiement } from "@/types/facture";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface PaiementDialogProps {
  facture: Facture | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPaiement: (id: string, paiement: Paiement) => Promise<void>;
}

export const PaiementDialog = ({
  facture,
  isOpen,
  onOpenChange,
  onPaiement,
}: PaiementDialogProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [montant, setMontant] = useState<string>("");
  const [mode, setMode] = useState<string>("especes");
  const [reference, setReference] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Réinitialiser le formulaire lorsque la facture change
  useEffect(() => {
    if (facture) {
      setDate(new Date());
      
      // Déterminer le montant restant à payer
      const resteAPayer = facture.montant - (facture.montant_paye || 0);
      setMontant(resteAPayer.toString());
      
      setMode("especes");
      setReference("");
    }
  }, [facture]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facture) return;

    setLoading(true);
    try {
      // Créer l'objet paiement
      const paiement: Paiement = {
        date: format(date, 'yyyy-MM-dd'),
        montant: parseFloat(montant),
        mode,
        reference: reference || undefined,
      };

      // Enregistrer le paiement
      await onPaiement(facture.id, paiement);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            {facture
              ? `Enregistrer un paiement pour la facture ${facture.id}`
              : "Veuillez sélectionner une facture"}
          </DialogDescription>
        </DialogHeader>

        {facture && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, "dd MMMM yyyy", { locale: fr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="montant" className="text-right">
                Montant
              </Label>
              <div className="col-span-3">
                <Input
                  id="montant"
                  value={montant}
                  onChange={(e) => {
                    // Permettre uniquement les nombres et le point décimal
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setMontant(value);
                  }}
                  className="text-right"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Reste à payer: {(facture.montant - (facture.montant_paye || 0)).toLocaleString()} FCFA
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mode" className="text-right">
                Mode
              </Label>
              <Select
                value={mode}
                onValueChange={setMode}
                defaultValue="especes"
              >
                <SelectTrigger className="col-span-3" id="mode">
                  <SelectValue placeholder="Mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="especes">Espèces</SelectItem>
                  <SelectItem value="cheque">Chèque</SelectItem>
                  <SelectItem value="virement">Virement</SelectItem>
                  <SelectItem value="carte">Carte bancaire</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(mode === "cheque" || mode === "virement" || mode === "mobile") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reference" className="text-right">
                  Référence
                </Label>
                <Input
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="col-span-3"
                  placeholder={
                    mode === "cheque"
                      ? "N° de chèque"
                      : mode === "virement"
                      ? "Référence du virement"
                      : "N° de transaction"
                  }
                />
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer le paiement"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
