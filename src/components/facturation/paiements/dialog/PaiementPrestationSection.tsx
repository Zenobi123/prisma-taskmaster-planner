
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PaiementPrestationSectionProps {
  selectedFactureId: string | null;
  typePaiement: "total" | "partiel";
  selectedPrestations: string[];
  onPrestationChange: (id: string, checked: boolean) => void;
  onPrestationAmountChange: (id: string, amount: number) => void;
  prestationAmounts: Record<string, number>;
  originalPrestationAmounts: Record<string, number>;
}

export const PaiementPrestationSection = ({
  selectedFactureId,
  typePaiement,
  selectedPrestations,
  onPrestationChange,
  onPrestationAmountChange,
  prestationAmounts,
  originalPrestationAmounts
}: PaiementPrestationSectionProps) => {
  const [prestations, setPrestations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedFactureId && typePaiement === "partiel") {
      fetchPrestationsForFacture(selectedFactureId);
    } else {
      setPrestations([]);
    }
  }, [selectedFactureId, typePaiement]);

  const fetchPrestationsForFacture = async (factureId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("prestations")
        .select("*")
        .eq("facture_id", factureId);

      if (error) throw error;
      setPrestations(data || []);
      console.log("Prestations récupérées:", data);
    } catch (error) {
      console.error("Erreur lors de la récupération des prestations:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les prestations de la facture."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Si aucune facture n'est sélectionnée ou si c'est un paiement total, ne rien afficher
  if (!selectedFactureId || typePaiement !== "partiel") {
    return null;
  }

  if (isLoading) {
    return <div className="text-center py-4">Chargement des prestations...</div>;
  }

  if (prestations.length === 0) {
    return <div className="text-center py-4">Aucune prestation trouvée pour cette facture.</div>;
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="font-medium text-sm">Prestations à payer</div>
      <div className="border rounded-md p-3 max-h-[300px] overflow-y-auto">
        {prestations.map((prestation) => {
          const isChecked = selectedPrestations.includes(prestation.id);
          const montantOriginal = originalPrestationAmounts[prestation.id] || Number(prestation.montant);
          const montantActuel = prestationAmounts[prestation.id] || montantOriginal;
          
          return (
            <div key={prestation.id} className="mb-3 pb-3 border-b last:border-b-0 last:mb-0 last:pb-0">
              <div className="flex items-start gap-2">
                <Checkbox
                  id={`prestation-${prestation.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    onPrestationChange(prestation.id, checked === true);
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`prestation-${prestation.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {prestation.description}
                  </Label>
                  <div className="text-xs text-gray-500 mt-1">
                    Montant original: {Number(prestation.montant).toLocaleString()} FCFA
                  </div>
                  
                  {isChecked && (
                    <div className="mt-2">
                      <Label htmlFor={`montant-${prestation.id}`} className="text-xs mb-1 block">
                        Montant à payer:
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`montant-${prestation.id}`}
                          type="number"
                          value={montantActuel}
                          onChange={(e) => {
                            const newAmount = Number(e.target.value);
                            if (!isNaN(newAmount) && newAmount >= 0) {
                              onPrestationAmountChange(prestation.id, newAmount);
                            }
                          }}
                          className="h-8 text-xs"
                        />
                        <span className="text-xs text-gray-500">FCFA</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
