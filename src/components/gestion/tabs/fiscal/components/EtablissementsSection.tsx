
import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Etablissement } from "@/hooks/fiscal/types/igsTypes";
import { Card } from "@/components/ui/card";
import { formatNumberWithSpaces, parseFormattedNumber } from "@/utils/formatUtils";

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
  // État local pour gérer les établissements
  const [localEtablissements, setLocalEtablissements] = useState<Etablissement[]>(etablissements);

  // Assurer qu'il y a toujours au moins un établissement
  useEffect(() => {
    if (localEtablissements.length === 0) {
      const defaultEtablissement: Etablissement = {
        nom: "Établissement principal",
        activite: "",
        ville: "",
        departement: "",
        quartier: "",
        chiffreAffaires: 0
      };
      
      setLocalEtablissements([defaultEtablissement]);
      onChange([defaultEtablissement]);
    }
  }, [localEtablissements, onChange]);

  // Initialiser avec les établissements fournis ou un établissement par défaut
  useEffect(() => {
    if (etablissements.length > 0) {
      setLocalEtablissements(etablissements);
    } else {
      const defaultEtablissement: Etablissement = {
        nom: "Établissement principal",
        activite: "",
        ville: "",
        departement: "",
        quartier: "",
        chiffreAffaires: 0
      };
      
      setLocalEtablissements([defaultEtablissement]);
      onChange([defaultEtablissement]);
    }
  }, []);

  // Calculer le total du chiffre d'affaires et le remonter au parent
  useEffect(() => {
    const total = localEtablissements.reduce((sum, etablissement) => 
      sum + (etablissement.chiffreAffaires || 0), 0);
    
    if (onTotalChange) {
      onTotalChange(total);
    }
  }, [localEtablissements, onTotalChange]);

  // Ajouter un nouvel établissement
  const handleAddEtablissement = () => {
    const newEtablissement: Etablissement = {
      nom: "",
      activite: "",
      ville: "",
      departement: "",
      quartier: "",
      chiffreAffaires: 0
    };

    const updatedEtablissements = [...localEtablissements, newEtablissement];
    setLocalEtablissements(updatedEtablissements);
    onChange(updatedEtablissements);
  };

  // Supprimer un établissement
  const handleRemoveEtablissement = (index: number) => {
    // Ne pas supprimer si c'est le dernier établissement
    if (localEtablissements.length <= 1) {
      return;
    }
    
    const updatedEtablissements = localEtablissements.filter((_, i) => i !== index);
    setLocalEtablissements(updatedEtablissements);
    onChange(updatedEtablissements);
  };

  // Mettre à jour un champ d'un établissement
  const handleEtablissementChange = (
    index: number,
    field: keyof Etablissement,
    value: string | number
  ) => {
    const updatedEtablissements = [...localEtablissements];
    
    if (field === "chiffreAffaires") {
      // Pour le chiffre d'affaires, s'assurer que c'est un nombre
      const parsedValue = typeof value === "string" ? parseFormattedNumber(value) : value;
      updatedEtablissements[index] = {
        ...updatedEtablissements[index],
        [field]: parsedValue
      };
    } else {
      // Pour les autres champs (texte)
      updatedEtablissements[index] = {
        ...updatedEtablissements[index],
        [field]: value
      };
    }
    
    setLocalEtablissements(updatedEtablissements);
    onChange(updatedEtablissements);
  };

  // Formater le chiffre d'affaires pour l'affichage
  const formatChiffreAffaires = (value: number): string => {
    return formatNumberWithSpaces(value);
  };

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
        <Card className="p-4 relative" key={index}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveEtablissement(index)}
            className="absolute top-2 right-2 text-destructive"
            disabled={localEtablissements.length <= 1}
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
                  handleEtablissementChange(index, "nom", e.target.value)
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
                  handleEtablissementChange(index, "activite", e.target.value)
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
                  handleEtablissementChange(index, "ville", e.target.value)
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
                  handleEtablissementChange(index, "departement", e.target.value)
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
                  handleEtablissementChange(index, "quartier", e.target.value)
                }
                placeholder="Quartier"
              />
            </div>
            
            <div>
              <Label htmlFor={`chiffreAffaires-${index}`}>Chiffre d'affaires HT (FCFA)</Label>
              <Input
                id={`chiffreAffaires-${index}`}
                value={formatChiffreAffaires(etablissement.chiffreAffaires)}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleEtablissementChange(index, "chiffreAffaires", e.target.value)
                }
                placeholder="0"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
