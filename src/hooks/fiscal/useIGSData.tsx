
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

  // Load IGS data when client or fiscal data changes
  useEffect(() => {
    if (isLoading || !selectedClient?.id) return;
    
    try {
      // Extract IGS data from fiscal data
      const extractedIGSData = extractIGSData(fiscalData, selectedClient);
      console.log("Extracted IGS data:", extractedIGSData);
      
      // Set defaults for any missing data
      if (extractedIGSData.chiffreAffairesAnnuel === undefined) {
        extractedIGSData.chiffreAffairesAnnuel = 0;
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
  }, [selectedClient, fiscalData, isLoading, toast]);
  
  // Handle updates to IGS data
  const handleIGSChange = useCallback((name: string, value: any) => {
    console.log("IGS change:", name, value);
    
    const parts = name.split('.');
    if (parts[0] === 'igs') {
      if (parts[1] === 'etablissements') {
        // Use the specialized handler for établissements
        const safeEtablissements = handleEtablissementsChange(value);
        
        // Update the main IGS data with the new établissements
        setIgsData(prev => ({
          ...prev,
          etablissements: safeEtablissements
        }));
      } else {
        // Handle all other IGS data changes
        setIgsData(prev => {
          const newData = {
            ...prev,
            [parts[1]]: value
          };
          
          console.log("New IGS state after update:", newData);
          return newData;
        });
      }
    }
  }, [handleEtablissementsChange]);

  // Combine the IGS data with the établissements for the complete data object
  const completeIGSData = {
    ...igsData,
    etablissements: localEtablissements
  };

  return { igsData: completeIGSData, handleIGSChange };
}
