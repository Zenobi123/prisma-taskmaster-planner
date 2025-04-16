
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
  const [localEtablissements, setLocalEtablissements] = useState<Etablissement[]>(etablissements);

  useEffect(() => {
    setLocalEtablissements(etablissements);
  }, [etablissements]);

  const addEtablissement = () => {
    const newEtablissements = [
      ...localEtablissements,
      {
        nom: "",
        activite: "",
        ville: "",
        departement: "",
        quartier: "",
        chiffreAffaires: 0
      }
    ];
    setLocalEtablissements(newEtablissements);
    onChange(newEtablissements);
  };

  const updateEtablissement = (index: number, field: keyof Etablissement, value: string | number) => {
    const newEtablissements = [...localEtablissements];
    newEtablissements[index] = {
      ...newEtablissements[index],
      [field]: field === "chiffreAffaires" ? Number(value.toString().replace(/\s/g, "")) || 0 : value
    };
    setLocalEtablissements(newEtablissements);
    onChange(newEtablissements);
  };

  const removeEtablissement = (index: number) => {
    const newEtablissements = localEtablissements.filter((_, i) => i !== index);
    setLocalEtablissements(newEtablissements);
    onChange(newEtablissements);
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
        ))}
      </div>
    </div>
  );
}
