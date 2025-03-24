
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedFactureId && !estCredit && typePaiement === "partiel") {
      fetchPrestationsForFacture(selectedFactureId);
    } else {
      setPrestations([]);
    }
  }, [selectedFactureId, estCredit, typePaiement]);

  const fetchPrestationsForFacture = async (factureId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("prestations")
        .select("*")
        .eq("facture_id", factureId);

      if (error) throw error;
      
      // S'assurer que nous avons des prestations à afficher
      if (data && data.length > 0) {
        setPrestations(data);
      } else {
        setPrestations([]);
        console.log("Aucune prestation trouvée pour cette facture");
      }
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

  if (estCredit || !selectedFactureId || typePaiement !== "partiel") {
    return null;
  }

  return (
    <div className="grid gap-1">
      <Label className="text-xs font-medium">Prestations à payer</Label>
      <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
        {isLoading ? (
          <div className="text-xs text-center py-2">Chargement des prestations...</div>
        ) : prestations.length > 0 ? (
          prestations.map((prestation) => (
            <div key={prestation.id} className="flex items-center space-x-2 mb-2 py-1 px-1 hover:bg-gray-50 rounded-sm">
              <Checkbox 
                id={`prestation-${prestation.id}`} 
                checked={selectedPrestations?.includes(prestation.id)}
                onCheckedChange={(checked) => onPrestationChange(prestation.id, checked === true)}
                className="h-4 w-4"
              />
              <Label htmlFor={`prestation-${prestation.id}`} className="text-xs cursor-pointer flex-1">
                <span className="font-medium">{prestation.description}</span>
                <span className="ml-2 text-gray-600">{prestation.montant.toLocaleString()} FCFA</span>
              </Label>
            </div>
          ))
        ) : (
          <div className="text-xs text-center py-2 text-gray-500">
            Aucune prestation trouvée pour cette facture
          </div>
        )}
      </div>
    </div>
  );
};

