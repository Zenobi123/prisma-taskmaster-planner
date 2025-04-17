
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Etablissement } from "@/hooks/fiscal/types/igsTypes";
import { EtablissementItem } from "./EtablissementItem";
import { useEtablissements } from "./useEtablissements";

interface EtablissementsSectionProps {
  etablissements: Etablissement[];
  onChange: (etablissements: Etablissement[]) => void;
  onTotalChange?: (total: number) => void;
}

export function EtablissementsSection({
  etablissements = [],
  onChange,
  onTotalChange
}: EtablissementsSectionProps) {
  const {
    etablissements: localEtablissements,
    handleAddEtablissement,
    handleRemoveEtablissement,
    handleEtablissementChange
  } = useEtablissements(etablissements, onChange, onTotalChange);

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Établissements</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddEtablissement}
          className="flex items-center gap-1"
        >
          <Plus size={16} /> Ajouter un établissement
        </Button>
      </div>

      {localEtablissements.map((etablissement, index) => (
        <EtablissementItem
          key={index}
          etablissement={etablissement}
          index={index}
          canDelete={localEtablissements.length > 1}
          onChange={handleEtablissementChange}
          onRemove={handleRemoveEtablissement}
        />
      ))}
    </div>
  );
}
