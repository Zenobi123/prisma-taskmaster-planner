
import { useState, useEffect, useCallback } from "react";
import { Client, Etablissement } from "@/types/client";
import { CGAClasse } from "./types";
import { IGSData } from "./types/igsTypes";
import { extractIGSData } from "./utils/loadFiscalData";
import { useToast } from "@/components/ui/use-toast";

export function useIGSData(
  selectedClient: Client,
  fiscalData: any,
  isLoading: boolean
) {
  const { toast } = useToast();
  
  // State for IGS data with default etablissements array
  const [igsData, setIgsData] = useState<IGSData & { chiffreAffairesAnnuel?: number, etablissements?: Etablissement[] }>({
    soumisIGS: false,
    adherentCGA: false,
    classeIGS: undefined,
    patente: { montant: '', quittance: '' },
    acompteJanvier: { montant: '', quittance: '' },
    acompteFevrier: { montant: '', quittance: '' },
    chiffreAffairesAnnuel: 0,
    etablissements: []
  });

  // Load IGS data when client or fiscal data changes
  useEffect(() => {
    if (isLoading || !selectedClient?.id) return;
    
    try {
      // Initialize IGS data
      const extractedIGSData = extractIGSData(fiscalData, selectedClient);
      console.log("Extracted IGS data:", extractedIGSData);
      
      // Make sure etablissements is initialized as an array
      if (!Array.isArray(extractedIGSData.etablissements)) {
        console.log("Établissements n'est pas un tableau, initialisation à un tableau vide");
        extractedIGSData.etablissements = [];
      }
      
      // Make sure chiffreAffairesAnnuel is initialized
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
  
  // Handle IGS data changes
  const handleIGSChange = useCallback((name: string, value: any) => {
    console.log("IGS change:", name, value);
    
    const parts = name.split('.');
    if (parts[0] === 'igs') {
      setIgsData(prev => {
        // Pour le cas spécifique des établissements, s'assurer que c'est toujours un tableau
        if (parts[1] === 'etablissements') {
          console.log("Mise à jour des établissements:", value);
          
          if (!Array.isArray(value)) {
            console.warn("Tentative de définir etablissements avec une valeur non-tableau:", value);
            value = [];
          }
        }
        
        const newData = {
          ...prev,
          [parts[1]]: value
        };
        
        console.log("Nouvel état IGS après mise à jour:", newData);
        return newData;
      });
    }
  }, []);

  return { igsData, handleIGSChange };
}
