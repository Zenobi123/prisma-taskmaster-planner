
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckSquare, ListChecks, Loader2 } from "lucide-react";

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
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <CheckSquare size={20} className="text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-700">Détails des prestations</h3>
        <p className="text-xs text-gray-500 mt-2 max-w-xs">
          Sélectionnez une facture et choisissez "Paiement partiel" pour afficher et sélectionner les prestations à payer
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-60 p-6">
        <Loader2 size={24} className="text-primary animate-spin mb-4" />
        <p className="text-sm text-gray-500">Chargement des prestations...</p>
      </div>
    );
  }

  if (prestations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <ListChecks size={20} className="text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-700">Aucune prestation</h3>
        <p className="text-xs text-gray-500 mt-2">Aucune prestation trouvée pour cette facture</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="font-medium text-sm flex items-center gap-2 text-gray-700">
        <ListChecks size={16} className="text-primary" />
        Prestations à payer
      </div>
      <div className="border rounded-md overflow-hidden divide-y divide-gray-100">
        {prestations.map((prestation) => {
          const isChecked = selectedPrestations.includes(prestation.id);
          const montantOriginal = originalPrestationAmounts[prestation.id] || Number(prestation.montant);
          const montantActuel = prestationAmounts[prestation.id] || montantOriginal;
          
          return (
            <div key={prestation.id} className={`p-3 transition-colors ${isChecked ? 'bg-primary/5' : 'hover:bg-gray-50'}`}>
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`prestation-${prestation.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    onPrestationChange(prestation.id, checked === true);
                  }}
                  className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`prestation-${prestation.id}`}
                    className="font-medium text-sm cursor-pointer"
                  >
                    {prestation.description}
                  </Label>
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    <span className="font-medium">Montant original:</span>
                    <span className="ml-1">{Number(prestation.montant).toLocaleString()} FCFA</span>
                  </div>
                  
                  {isChecked && (
                    <div className="mt-3 bg-white p-2 rounded-md border border-gray-200 shadow-sm">
                      <Label htmlFor={`montant-${prestation.id}`} className="text-xs font-medium mb-1.5 block text-primary">
                        Montant à payer:
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
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
                            className="h-8 pr-14 text-sm border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-xs font-medium text-gray-500 bg-gray-50 border-l border-gray-300 rounded-r-md">
                            FCFA
                          </div>
                        </div>
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
