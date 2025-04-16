
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Etablissement } from "@/types/client";
import { formatNumberWithSpaces } from "@/utils/formatUtils";

interface EtablissementsSectionProps {
  etablissements: Etablissement[];
  onChange: (etablissements: Etablissement[]) => void;
}

export function EtablissementsSection({
  etablissements = [],
  onChange
}: EtablissementsSectionProps) {
  const [localEtablissements, setLocalEtablissements] = useState<Etablissement[]>([]);

  // Met à jour l'état local quand les props changent
  useEffect(() => {
    console.log("EtablissementsSection - Props etablissements reçus:", etablissements);
    // Garantir que etablissements est toujours un tableau, même s'il est null ou undefined
    const safeEtablissements = Array.isArray(etablissements) ? [...etablissements] : [];
    console.log("EtablissementsSection - Établissements sécurisés:", safeEtablissements);
    setLocalEtablissements(safeEtablissements);
  }, [etablissements]);

  const addEtablissement = () => {
    // Créer un nouvel établissement avec des valeurs par défaut
    const newEtablissement: Etablissement = {
      nom: "",
      activite: "",
      ville: "",
      departement: "",
      quartier: "",
      chiffreAffaires: 0
    };
    
    // Créer une copie du tableau existant
    const currentEtablissements = Array.isArray(localEtablissements) 
      ? [...localEtablissements] 
      : [];
    
    // Ajouter le nouvel établissement à la liste existante
    const newEtablissements = [...currentEtablissements, newEtablissement];
    
    console.log("Ajout d'un nouvel établissement:", newEtablissement);
    console.log("Nouvelle liste d'établissements:", newEtablissements);
    
    // Mettre à jour l'état local
    setLocalEtablissements(newEtablissements);
    
    // Propager le changement au parent - CRUCIAL
    onChange(newEtablissements);
  };

  const updateEtablissement = (index: number, field: keyof Etablissement, value: string | number) => {
    if (index < 0 || !Array.isArray(localEtablissements) || index >= localEtablissements.length) {
      console.error("Index d'établissement invalide:", index);
      return;
    }
    
    // Créer une copie complète pour éviter les problèmes de référence
    const updatedEtablissements = localEtablissements.map((etab, i) => 
      i === index 
        ? { 
            ...etab, 
            [field]: field === "chiffreAffaires" 
                    ? Number(String(value).replace(/\s/g, "")) || 0 
                    : value 
          }
        : etab
    );
    
    console.log(`Mise à jour de l'établissement ${index}, champ ${field}:`, updatedEtablissements[index]);
    
    // Mettre à jour l'état local
    setLocalEtablissements(updatedEtablissements);
    
    // Propager le changement au parent
    onChange(updatedEtablissements);
  };

  const removeEtablissement = (index: number) => {
    if (index < 0 || !Array.isArray(localEtablissements) || index >= localEtablissements.length) {
      console.error("Index d'établissement invalide pour la suppression:", index);
      return;
    }
    
    console.log(`Suppression de l'établissement à l'index ${index}`);
    const updatedEtablissements = localEtablissements.filter((_, i) => i !== index);
    
    // Mettre à jour l'état local
    setLocalEtablissements(updatedEtablissements);
    
    // Propager le changement au parent
    onChange(updatedEtablissements);
  };

  // Déterminer si la liste d'établissements est vide
  const hasEtablissements = Array.isArray(localEtablissements) && localEtablissements.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Établissements</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addEtablissement}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un établissement
        </Button>
      </div>

      <div className="space-y-6">
        {hasEtablissements ? (
          localEtablissements.map((etablissement, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeEtablissement(index)}
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`nom-${index}`}>Nom Commercial</Label>
                  <Input
                    id={`nom-${index}`}
                    value={etablissement.nom || ""}
                    onChange={(e) => updateEtablissement(index, "nom", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`activite-${index}`}>Activité</Label>
                  <Input
                    id={`activite-${index}`}
                    value={etablissement.activite || ""}
                    onChange={(e) => updateEtablissement(index, "activite", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`ville-${index}`}>Ville</Label>
                  <Input
                    id={`ville-${index}`}
                    value={etablissement.ville || ""}
                    onChange={(e) => updateEtablissement(index, "ville", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`departement-${index}`}>Département</Label>
                  <Input
                    id={`departement-${index}`}
                    value={etablissement.departement || ""}
                    onChange={(e) => updateEtablissement(index, "departement", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`quartier-${index}`}>Quartier</Label>
                  <Input
                    id={`quartier-${index}`}
                    value={etablissement.quartier || ""}
                    onChange={(e) => updateEtablissement(index, "quartier", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`ca-${index}`}>Chiffre d'affaires HT (FCFA)</Label>
                  <Input
                    id={`ca-${index}`}
                    value={formatNumberWithSpaces(etablissement.chiffreAffaires || 0)}
                    onChange={(e) => updateEtablissement(index, "chiffreAffaires", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Aucun établissement. Cliquez sur "Ajouter un établissement" pour en créer un.
          </div>
        )}
      </div>
    </div>
  );
}
