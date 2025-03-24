
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface Prestation {
  id: string;
  description: string;
  montant: number;
  quantite: number;
  montant_modifie?: number;
}

interface PaiementPrestationSectionProps {
  selectedFactureId: string | null;
  estCredit: boolean;
  typePaiement: "total" | "partiel";
  selectedPrestations: string[];
  onPrestationChange: (id: string, checked: boolean, montant?: number) => void;
}

export const PaiementPrestationSection = ({
  selectedFactureId,
  estCredit,
  typePaiement,
  selectedPrestations,
  onPrestationChange
}: PaiementPrestationSectionProps) => {
  const [prestations, setPrestations] = useState<Prestation[]>([]);
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
        console.log("Prestations récupérées:", data.length, data);
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

  const handleAmountChange = (id: string, montant: number) => {
    const prestation = prestations.find(p => p.id === id);
    if (!prestation) return;

    // Update montant_modifie in local state
    const updatedPrestations = prestations.map(p => 
      p.id === id ? { ...p, montant_modifie: montant } : p
    );
    setPrestations(updatedPrestations);
    
    // Notify parent component about the change
    onPrestationChange(id, selectedPrestations.includes(id), montant);
  };

  // Si c'est un crédit ou pas un paiement partiel, on ne montre pas cette section
  if (estCredit || typePaiement !== "partiel") {
    return null;
  }

  return (
    <ScrollArea className="flex-1 h-full pr-1">
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-xs">Chargement des prestations...</span>
          </div>
        ) : selectedFactureId ? (
          prestations.length > 0 ? (
            <div className="space-y-1">
              {prestations.map((prestation) => (
                <div 
                  key={prestation.id} 
                  className="flex flex-col p-2 bg-white border rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2 cursor-pointer" 
                    onClick={() => onPrestationChange(
                      prestation.id, 
                      !selectedPrestations?.includes(prestation.id),
                      prestation.montant_modifie
                    )}
                  >
                    <Checkbox 
                      id={`prestation-${prestation.id}`} 
                      checked={selectedPrestations?.includes(prestation.id)}
                      onCheckedChange={(checked) => onPrestationChange(
                        prestation.id, 
                        checked === true,
                        prestation.montant_modifie
                      )}
                      className="h-4 w-4"
                    />
                    <div className="flex-1 text-xs">
                      <div className="font-medium">{prestation.description}</div>
                      <div className="text-gray-600">
                        Montant initial: {prestation.montant.toLocaleString()} FCFA
                      </div>
                    </div>
                  </div>

                  {/* Montant modifiable - visible uniquement lorsque la prestation est sélectionnée */}
                  {selectedPrestations?.includes(prestation.id) && (
                    <div className="mt-2 pl-6">
                      <Label htmlFor={`montant-${prestation.id}`} className="text-xs mb-1 block">
                        Montant à payer
                      </Label>
                      <Input
                        id={`montant-${prestation.id}`}
                        type="number"
                        className="h-7 text-xs"
                        value={prestation.montant_modifie !== undefined ? prestation.montant_modifie : prestation.montant}
                        onChange={(e) => handleAmountChange(prestation.id, parseFloat(e.target.value) || 0)}
                        min={0}
                        max={prestation.montant}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-center py-4 text-gray-500">
              Aucune prestation trouvée pour cette facture
            </div>
          )
        ) : (
          <div className="text-xs text-center py-4 text-gray-500">
            Veuillez sélectionner une facture
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
