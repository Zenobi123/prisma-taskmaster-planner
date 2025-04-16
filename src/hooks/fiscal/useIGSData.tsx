
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
  
  // State for IGS data with default values
  const [igsData, setIgsData] = useState<IGSData & { chiffreAffairesAnnuel?: number }>({
    soumisIGS: false,
    adherentCGA: false,
    classeIGS: undefined,
    patente: { montant: '', quittance: '' },
    acompteJanvier: { montant: '', quittance: '' },
    acompteFevrier: { montant: '', quittance: '' },
    chiffreAffairesAnnuel: 0,
    etablissements: [] // Initialize with empty array
  });

  // Extract établissements handling to the separate hook
  const { localEtablissements, handleEtablissementsChange } = useEtablissementsData(
    igsData.etablissements
  );

  // Load IGS data when client or fiscal data changes
  useEffect(() => {
    if (isLoading || !selectedClient?.id) return;
    
    try {
      // Initialize IGS data
      const extractedIGSData = extractIGSData(fiscalData, selectedClient);
      console.log("Extracted IGS data:", extractedIGSData);
      
      // Make sure chiffreAffairesAnnuel is initialized
      if (extractedIGSData.chiffreAffairesAnnuel === undefined) {
        extractedIGSData.chiffreAffairesAnnuel = 0;
      }
      
      // Make sure etablissements is always initialized as an array
      if (!Array.isArray(extractedIGSData.etablissements)) {
        extractedIGSData.etablissements = [];
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
  
  // Handle IGS data changes
  const handleIGSChange = useCallback((name: string, value: any) => {
    console.log("IGS change:", name, value);
    
    const parts = name.split('.');
    if (parts[0] === 'igs') {
      if (parts[1] === 'etablissements') {
        // Use the specialized établissements handler
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
