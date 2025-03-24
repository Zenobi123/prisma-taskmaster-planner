
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FileText, AlertCircle } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedClientId && !estCredit) {
      fetchFacturesForClient(selectedClientId);
    } else {
      setFactures([]);
    }
  }, [selectedClientId, estCredit]);

  const fetchFacturesForClient = async (clientId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("factures")
        .select("*")
        .eq("client_id", clientId)
        .or("status_paiement.eq.non_payée,status_paiement.eq.partiellement_payée,status_paiement.eq.en_retard")
        .eq("status", "envoyée");

      if (error) throw error;
      setFactures(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les factures du client."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (estCredit || !selectedClientId) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Facture selection */}
      <div className="grid gap-1.5">
        <Label htmlFor="facture_id" className="text-xs font-medium flex items-center gap-1.5">
          <FileText size={14} className="text-gray-500" />
          Facture
        </Label>
        <Select onValueChange={onFactureChange} value={selectedFactureId || undefined}>
          <SelectTrigger className="h-9 text-sm bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20" disabled={isLoading}>
            <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner une facture"} />
          </SelectTrigger>
          <SelectContent>
            {factures.length > 0 ? (
              factures.map((facture) => (
                <SelectItem key={facture.id} value={facture.id} className="text-sm">
                  {facture.id} - {(facture.montant - (facture.montant_paye || 0)).toLocaleString()} FCFA
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-factures" disabled className="text-sm flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-500" />
                <span className="text-gray-500">Aucune facture non payée</span>
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Type de paiement options - seulement visible si une facture est sélectionnée */}
      {selectedFactureId && (
        <div className="grid gap-1.5 bg-gray-50 p-2.5 rounded-md border border-gray-100">
          <Label className="text-xs font-medium mb-1">Type de paiement</Label>
          <RadioGroup 
            value={typePaiement}
            onValueChange={(value: "total" | "partiel") => onTypePaiementChange(value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="total" id="total" className="h-4 w-4 text-primary border-gray-400" />
              <Label htmlFor="total" className="text-sm cursor-pointer">Paiement total</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partiel" id="partiel" className="h-4 w-4 text-primary border-gray-400" />
              <Label htmlFor="partiel" className="text-sm cursor-pointer">Paiement partiel</Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
};
