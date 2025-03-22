
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PaiementFactureSectionProps {
  selectedClientId: string | null;
  estCredit: boolean;
  selectedFactureId: string | null;
  typePaiement: "total" | "partiel";
  onFactureChange: (factureId: string) => void;
  onTypePaiementChange: (value: "total" | "partiel") => void;
}

export const PaiementFactureSection = ({
  selectedClientId,
  estCredit,
  selectedFactureId,
  typePaiement,
  onFactureChange,
  onTypePaiementChange
}: PaiementFactureSectionProps) => {
  const [factures, setFactures] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedClientId) {
      fetchFacturesForClient(selectedClientId);
    }
  }, [selectedClientId]);

  const fetchFacturesForClient = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from("factures")
        .select("*")
        .eq("client_id", clientId)
        .or("status_paiement.eq.non_payée,status_paiement.eq.partiellement_payée");

      if (error) throw error;
      setFactures(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les factures du client."
      });
    }
  };

  if (estCredit || !selectedClientId) {
    return null;
  }

  return (
    <>
      {/* Facture selection */}
      <div className="grid gap-1">
        <Label htmlFor="facture_id" className="text-xs font-medium">Facture</Label>
        <Select onValueChange={onFactureChange} value={selectedFactureId || undefined}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Sélectionner une facture" />
          </SelectTrigger>
          <SelectContent>
            {factures.map((facture) => (
              <SelectItem key={facture.id} value={facture.id} className="text-xs">
                {facture.id} - {facture.montant - (facture.montant_paye || 0)} FCFA
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type de paiement options - seulement visible si une facture est sélectionnée */}
      {selectedFactureId && (
        <div className="grid gap-1">
          <Label className="text-xs font-medium">Type de paiement</Label>
          <RadioGroup 
            defaultValue="total" 
            value={typePaiement}
            onValueChange={(value: "total" | "partiel") => onTypePaiementChange(value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="total" id="total" className="h-3 w-3" />
              <Label htmlFor="total" className="text-xs">Paiement total</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="partiel" id="partiel" className="h-3 w-3" />
              <Label htmlFor="partiel" className="text-xs">Paiement partiel</Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </>
  );
};
