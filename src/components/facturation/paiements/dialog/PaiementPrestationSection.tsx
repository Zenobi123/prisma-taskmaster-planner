
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PaiementPrestationSectionProps {
  selectedFactureId: string | null;
  estCredit: boolean;
  typePaiement: "total" | "partiel";
  selectedPrestations: string[];
  onPrestationChange: (id: string, checked: boolean) => void;
}

export const PaiementPrestationSection = ({
  selectedFactureId,
  estCredit,
  typePaiement,
  selectedPrestations,
  onPrestationChange
}: PaiementPrestationSectionProps) => {
  const [prestations, setPrestations] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedFactureId && !estCredit) {
      fetchPrestationsForFacture(selectedFactureId);
    } else {
      setPrestations([]);
    }
  }, [selectedFactureId, estCredit]);

  const fetchPrestationsForFacture = async (factureId: string) => {
    try {
      const { data, error } = await supabase
        .from("prestations")
        .select("*")
        .eq("facture_id", factureId);

      if (error) throw error;
      setPrestations(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des prestations:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les prestations de la facture."
      });
    }
  };

  if (estCredit || !selectedFactureId || typePaiement !== "partiel" || prestations.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-1">
      <Label className="text-xs font-medium">Prestations à payer</Label>
      <div className="max-h-28 overflow-y-auto border rounded p-1">
        {prestations.map((prestation) => (
          <div key={prestation.id} className="flex items-center space-x-2 mb-1">
            <Checkbox 
              id={`prestation-${prestation.id}`} 
              checked={selectedPrestations?.includes(prestation.id)}
              onCheckedChange={(checked) => onPrestationChange(prestation.id, checked === true)}
              className="h-3 w-3"
            />
            <Label htmlFor={`prestation-${prestation.id}`} className="text-xs">
              {prestation.description} - {prestation.montant} FCFA
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
