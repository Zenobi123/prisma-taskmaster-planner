
import { useState, useEffect } from "react";
import { Etablissement } from "@/hooks/fiscal/types/igsTypes";
import { parseFormattedNumber } from "@/utils/formatUtils";

export function useEtablissements(
  initialEtablissements: Etablissement[] = [],
  onChange: (etablissements: Etablissement[]) => void,
  onTotalChange?: (total: number) => void
) {
  // État local pour gérer les établissements
  const [etablissements, setEtablissements] = useState<Etablissement[]>(initialEtablissements);

  // Initialiser avec les établissements fournis ou un établissement par défaut
  useEffect(() => {
    if (initialEtablissements.length > 0) {
      setEtablissements(initialEtablissements);
    } else {
      const defaultEtablissement: Etablissement = {
        nom: "Établissement principal",
        activite: "",
        ville: "",
        departement: "",
        quartier: "",
        chiffreAffaires: 0
      };
      
      setEtablissements([defaultEtablissement]);
      onChange([defaultEtablissement]);
    }
  }, []);

  // Assurer qu'il y a toujours au moins un établissement
  useEffect(() => {
    if (etablissements.length === 0) {
      const defaultEtablissement: Etablissement = {
        nom: "Établissement principal",
        activite: "",
        ville: "",
        departement: "",
        quartier: "",
        chiffreAffaires: 0
      };
      
      setEtablissements([defaultEtablissement]);
      onChange([defaultEtablissement]);
    }
  }, [etablissements, onChange]);

  // Calculer le total du chiffre d'affaires et le remonter au parent
  useEffect(() => {
    const total = etablissements.reduce((sum, etablissement) => 
      sum + (etablissement.chiffreAffaires || 0), 0);
    
    if (onTotalChange) {
      onTotalChange(total);
    }
  }, [etablissements, onTotalChange]);

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

    const updatedEtablissements = [...etablissements, newEtablissement];
    setEtablissements(updatedEtablissements);
    onChange(updatedEtablissements);
  };

  // Supprimer un établissement
  const handleRemoveEtablissement = (index: number) => {
    // Ne pas supprimer si c'est le dernier établissement
    if (etablissements.length <= 1) {
      return;
    }
    
    const updatedEtablissements = etablissements.filter((_, i) => i !== index);
    setEtablissements(updatedEtablissements);
    onChange(updatedEtablissements);
  };

  // Mettre à jour un champ d'un établissement
  const handleEtablissementChange = (
    index: number,
    field: keyof Etablissement,
    value: string | number
  ) => {
    const updatedEtablissements = [...etablissements];
    
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
    
    setEtablissements(updatedEtablissements);
    onChange(updatedEtablissements);
  };

  return {
    etablissements,
    handleAddEtablissement,
    handleRemoveEtablissement,
    handleEtablissementChange
  };
}
