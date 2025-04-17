
import { useState, useEffect, useCallback } from "react";
import { Client } from "@/types/client";
import { CGAClasse } from "./types";
import { IGSData, Etablissement } from "./types/igsTypes";
import { extractIGSData } from "./utils/loadFiscalData";
import { useToast } from "@/components/ui/use-toast";

export function useIGSData(
  selectedClient: Client,
  fiscalData: any,
  isLoading: boolean
) {
  const { toast } = useToast();
  
  // Initialize IGS data with default values
  const [igsData, setIgsData] = useState<IGSData & { chiffreAffairesAnnuel?: number; etablissements?: Etablissement[] }>({
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
      // Extract IGS data from fiscal data
      const extractedIGSData = extractIGSData(fiscalData, selectedClient);
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
    console.log(`handleIGSChange called with: ${name} = `, value);
    
    const parts = name.split('.');
    
    if (parts[0] === 'igs') {
      if (parts[1] === 'chiffreAffairesAnnuel') {
        // Si on met à jour directement le chiffre d'affaires annuel,
        // convertir la valeur en nombre si nécessaire
        const caValue = typeof value === 'number' ? value : 0;
        
        console.log("Mise à jour directe du chiffre d'affaires annuel:", caValue);

        setIgsData(prev => ({
          ...prev,
          [parts[1]]: caValue
        }));
      } else if (parts[1] === 'etablissements') {
        // Si on met à jour les établissements, s'assurer qu'ils sont bien des tableaux
        const etablissements = Array.isArray(value) ? value : [];
        
        console.log("Mise à jour des établissements:", etablissements);
        
        setIgsData(prev => ({
          ...prev,
          [parts[1]]: etablissements
        }));
      } else {
        // Gérer toutes les autres modifications de données IGS
        setIgsData(prev => ({
          ...prev,
          [parts[1]]: value
        }));
      }
    }
  }, []);

  return { igsData, handleIGSChange };
}
