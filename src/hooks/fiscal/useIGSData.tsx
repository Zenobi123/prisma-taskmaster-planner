
import { useState, useEffect, useCallback } from "react";
import { Client } from "@/types/client";
import { CGAClasse } from "./types";
import { IGSData } from "./types/igsTypes";
import { extractIGSData } from "./utils/loadFiscalData";
import { useToast } from "@/components/ui/use-toast";
import { useEtablissementsData } from "./useEtablissementsData";

export function useIGSData(
  selectedClient: Client,
  fiscalData: any,
  isLoading: boolean
) {
  const { toast } = useToast();
  
  // Initialize IGS data with default values
  const [igsData, setIgsData] = useState<IGSData & { chiffreAffairesAnnuel?: number }>({
    soumisIGS: false,
    adherentCGA: false,
    classeIGS: undefined,
    patente: { montant: '', quittance: '' },
    acompteJanvier: { montant: '', quittance: '' },
    acompteFevrier: { montant: '', quittance: '' },
    chiffreAffairesAnnuel: 0,
    etablissements: []
  });

  // Use the établissements data hook for handling that specific part of IGS data
  const { localEtablissements, handleEtablissementsChange } = useEtablissementsData(
    igsData.etablissements
  );

  // Calculate total turnover from all establishments
  const calculateTotalTurnover = useCallback((etablissements) => {
    if (!Array.isArray(etablissements) || etablissements.length === 0) return 0;
    return etablissements.reduce((sum, etab) => {
      // S'assurer que la valeur est bien un nombre
      const caValue = typeof etab.chiffreAffaires === 'number' ? etab.chiffreAffaires : 0;
      return sum + caValue;
    }, 0);
  }, []);

  // Load IGS data when client or fiscal data changes
  useEffect(() => {
    if (isLoading || !selectedClient?.id) return;
    
    try {
      // Extract IGS data from fiscal data
      const extractedIGSData = extractIGSData(fiscalData, selectedClient);
      
      // Set defaults for any missing data
      if (extractedIGSData.chiffreAffairesAnnuel === undefined) {
        // If no annual turnover is set, calculate it from establishments
        const calculatedTotal = calculateTotalTurnover(extractedIGSData.etablissements);
        extractedIGSData.chiffreAffairesAnnuel = calculatedTotal;
      }
      
      setIgsData(extractedIGSData);
    } catch (error) {
      console.error("Error initializing IGS data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données IGS",
        variant: "destructive"
      });
    }
  }, [selectedClient, fiscalData, isLoading, toast, calculateTotalTurnover]);
  
  // Handle updates to IGS data
  const handleIGSChange = useCallback((name: string, value: any) => {
    const parts = name.split('.');
    
    if (parts[0] === 'igs') {
      if (parts[1] === 'etablissements') {
        // Convertir en tableau si ce n'est pas déjà le cas
        const safeEtablissements = Array.isArray(value) ? value : [];
        
        // Utiliser le gestionnaire spécialisé pour les établissements
        const updatedEtablissements = handleEtablissementsChange(safeEtablissements);
        
        // Calculer le nouveau chiffre d'affaires total à partir de tous les établissements
        const newTotalTurnover = calculateTotalTurnover(updatedEtablissements);
        
        console.log("Mise à jour des établissements:", updatedEtablissements);
        console.log("Nouveau chiffre d'affaires total calculé:", newTotalTurnover);
        
        // Mettre à jour à la fois les établissements et le chiffre d'affaires annuel
        setIgsData(prev => ({
          ...prev,
          etablissements: updatedEtablissements,
          chiffreAffairesAnnuel: newTotalTurnover
        }));
      } else if (parts[1] === 'chiffreAffairesAnnuel') {
        // Si on met à jour directement le chiffre d'affaires annuel,
        // convertir la valeur en nombre si nécessaire
        const caValue = typeof value === 'number' ? value : 0;
        
        console.log("Mise à jour directe du chiffre d'affaires annuel:", caValue);

        setIgsData(prev => ({
          ...prev,
          [parts[1]]: caValue
        }));
      } else {
        // Gérer toutes les autres modifications de données IGS
        setIgsData(prev => ({
          ...prev,
          [parts[1]]: value
        }));
      }
    }
  }, [handleEtablissementsChange, calculateTotalTurnover]);

  // Combiner les données IGS avec les établissements pour l'objet de données complet
  const completeIGSData = {
    ...igsData,
    etablissements: localEtablissements
  };

  return { igsData: completeIGSData, handleIGSChange };
}
