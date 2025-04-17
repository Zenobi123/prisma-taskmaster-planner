
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Etablissement } from "@/types/client";
import { EtablissementCard } from "./EtablissementCard";
import { createDefaultEtablissement } from "./utils";

interface EtablissementsSectionProps {
  etablissements: Etablissement[];
  onChange: (etablissements: Etablissement[]) => void;
}

export function EtablissementsSection({
  etablissements = [],
  onChange
}: EtablissementsSectionProps) {
  // État local pour suivre les établissements
  const [localEtablissements, setLocalEtablissements] = useState<Etablissement[]>([]);

  // Met à jour l'état local quand les props changent
  useEffect(() => {
    console.log("EtablissementsSection - Props etablissements reçus:", etablissements);
    // Garantir que etablissements est toujours un tableau non vide
    let safeEtablissements: Etablissement[] = [];
    
    if (Array.isArray(etablissements) && etablissements.length > 0) {
      safeEtablissements = [...etablissements];
    } else {
      safeEtablissements = [createDefaultEtablissement()];
    }
    
    console.log("EtablissementsSection - Établissements sécurisés:", safeEtablissements);
    setLocalEtablissements(safeEtablissements);
  }, [etablissements]);

  const addEtablissement = () => {
    // Créer un nouvel établissement avec des valeurs par défaut
    const newEtablissement = createDefaultEtablissement();
    
    // Créer une copie du tableau existant et vérifier qu'il est bien un tableau
    const currentEtablissements = Array.isArray(localEtablissements) 
      ? [...localEtablissements] 
      : [createDefaultEtablissement()];
    
    // Ajouter le nouvel établissement à la liste existante
    const newEtablissements = [...currentEtablissements, newEtablissement];
    
    console.log("Ajout d'un nouvel établissement:", newEtablissement);
    console.log("Nouvelle liste d'établissements:", newEtablissements);
    
    // Mettre à jour l'état local
    setLocalEtablissements(newEtablissements);
    
    // IMPORTANT - Propager immédiatement le changement au parent
    onChange(newEtablissements);
  };

  const updateEtablissement = (index: number, field: keyof Etablissement, value: string | number) => {
    if (index < 0 || !Array.isArray(localEtablissements) || index >= localEtablissements.length) {
      console.error("Index d'établissement invalide:", index);
      return;
    }
    
    // Créer une copie complète pour éviter les problèmes de référence
    const updatedEtablissements = localEtablissements.map((etab, i) => {
      if (i !== index) return etab;
      
      // Pour le champ chiffreAffaires, s'assurer que c'est bien un nombre
      if (field === "chiffreAffaires") {
        const numValue = typeof value === 'string' 
          ? Number(value.replace(/\s/g, "")) || 0
          : Number(value) || 0;
          
        return { ...etab, [field]: numValue };
      }
      
      // Pour les autres champs
      return { ...etab, [field]: value };
    });
    
    console.log(`Mise à jour de l'établissement ${index}, champ ${field}:`, updatedEtablissements[index]);
    
    // Mettre à jour l'état local
    setLocalEtablissements(updatedEtablissements);
    
    // Propager le changement au parent - immédiatement
    onChange(updatedEtablissements);
  };

  const removeEtablissement = (index: number) => {
    if (index < 0 || !Array.isArray(localEtablissements) || index >= localEtablissements.length) {
      console.error("Index d'établissement invalide pour la suppression:", index);
      return;
    }
    
    // Ne pas permettre la suppression si c'est le seul établissement
    if (localEtablissements.length <= 1) {
      console.log("Impossible de supprimer le seul établissement disponible");
      return;
    }
    
    console.log(`Suppression de l'établissement à l'index ${index}`);
    const updatedEtablissements = localEtablissements.filter((_, i) => i !== index);
    
    // Mettre à jour l'état local
    setLocalEtablissements(updatedEtablissements);
    
    // Propager le changement au parent - immédiatement
    onChange(updatedEtablissements);
  };

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
        {localEtablissements.map((etablissement, index) => (
          <EtablissementCard
            key={index}
            etablissement={etablissement}
            index={index}
            canDelete={localEtablissements.length > 1}
            updateEtablissement={updateEtablissement}
            removeEtablissement={removeEtablissement}
          />
        ))}
      </div>
    </div>
  );
}
