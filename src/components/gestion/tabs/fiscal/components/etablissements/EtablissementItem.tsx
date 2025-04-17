
import React, { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Etablissement } from "@/hooks/fiscal/types/igsTypes";
import { formatNumberWithSpaces } from "@/utils/formatUtils";

interface EtablissementItemProps {
  etablissement: Etablissement;
  index: number;
  canDelete: boolean;
  onChange: (index: number, field: keyof Etablissement, value: string | number) => void;
  onRemove: (index: number) => void;
}

export function EtablissementItem({
  etablissement,
  index,
  canDelete,
  onChange,
  onRemove
}: EtablissementItemProps) {
  // Format the chiffre d'affaires for display
  const formattedChiffreAffaires = formatNumberWithSpaces(etablissement.chiffreAffaires);
  
  return (
    <Card className="p-4 relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 text-destructive"
        disabled={!canDelete}
      >
        <Trash2 size={16} />
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`nom-${index}`}>Nom Commercial</Label>
          <Input
            id={`nom-${index}`}
            value={etablissement.nom}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(index, "nom", e.target.value)
            }
            placeholder="Nom de l'établissement"
          />
        </div>
        
        <div>
          <Label htmlFor={`activite-${index}`}>Activité</Label>
          <Input
            id={`activite-${index}`}
            value={etablissement.activite}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(index, "activite", e.target.value)
            }
            placeholder="Activité principale"
          />
        </div>
        
        <div>
          <Label htmlFor={`ville-${index}`}>Ville</Label>
          <Input
            id={`ville-${index}`}
            value={etablissement.ville}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(index, "ville", e.target.value)
            }
            placeholder="Ville"
          />
        </div>
        
        <div>
          <Label htmlFor={`departement-${index}`}>Département</Label>
          <Input
            id={`departement-${index}`}
            value={etablissement.departement}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(index, "departement", e.target.value)
            }
            placeholder="Département"
          />
        </div>
        
        <div>
          <Label htmlFor={`quartier-${index}`}>Quartier</Label>
          <Input
            id={`quartier-${index}`}
            value={etablissement.quartier}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(index, "quartier", e.target.value)
            }
            placeholder="Quartier"
          />
        </div>
        
        <div>
          <Label htmlFor={`chiffreAffaires-${index}`}>Chiffre d'affaires HT (FCFA)</Label>
          <Input
            id={`chiffreAffaires-${index}`}
            value={formattedChiffreAffaires}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(index, "chiffreAffaires", e.target.value)
            }
            placeholder="0"
          />
        </div>
      </div>
    </Card>
  );
}
