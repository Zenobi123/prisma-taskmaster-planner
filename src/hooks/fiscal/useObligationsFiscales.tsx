
import { useState, useEffect, useCallback } from "react";
import { Client, Etablissement } from "@/types/client";
import { useUpdateClientMutation } from "@/pages/clients/hooks/mutations/useUpdateClientMutation";
import { ObligationStatuses, ClientFiscalData, CGAClasse } from "./types";
import { IGSData } from "./types/igsTypes";
import { loadFiscalData, extractIGSData } from "./utils/loadFiscalData";
import { prepareFiscalData, extractClientIGSData } from "./utils/saveFiscalData";
import { useToast } from "@/components/ui/use-toast";

export function useObligationsFiscales(selectedClient: Client) {
  const { toast } = useToast();
  
  // States for fiscal attestation
  const [creationDate, setCreationDate] = useState("");
  const [validityEndDate, setValidityEndDate] = useState("");
  const [showInAlert, setShowInAlert] = useState(false);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState(false);
  
  // State for fiscal obligations - ensure all properties are initialized
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    patente: { assujetti: false, paye: false },
    bail: { assujetti: false, paye: false },
    taxeFonciere: { assujetti: false, paye: false },
    dsf: { assujetti: false, depose: false },
    darp: { assujetti: false, depose: false },
    tva: { assujetti: false, paye: false },
    cnps: { assujetti: false, paye: false }
  });
  
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
  
  const [isLoading, setIsLoading] = useState(true);
  const { mutateAsync } = useUpdateClientMutation();

  // Load client's fiscal data
  useEffect(() => {
    const fetchFiscalData = async () => {
      if (!selectedClient?.id) return;
      
      setIsLoading(true);
      
      try {
        const fiscalData = await loadFiscalData(selectedClient.id);
        console.log("Fiscal data loaded:", fiscalData);
        
        // Initialize attestation data
        if (fiscalData?.attestation) {
          setCreationDate(fiscalData.attestation.creationDate || "");
          setValidityEndDate(fiscalData.attestation.validityEndDate || "");
          setShowInAlert(!!fiscalData.attestation.showInAlert);
        }
        
        // Initialize obligations with default values for any missing properties
        if (fiscalData?.obligations) {
          const defaultObligations: ObligationStatuses = {
            patente: { assujetti: false, paye: false },
            bail: { assujetti: false, paye: false },
            taxeFonciere: { assujetti: false, paye: false },
            dsf: { assujetti: false, depose: false },
            darp: { assujetti: false, depose: false },
            tva: { assujetti: false, paye: false },
            cnps: { assujetti: false, paye: false }
          };
          
          // Merge existing obligations with defaults to ensure all properties exist
          setObligationStatuses({
            ...defaultObligations,
            ...fiscalData.obligations
          });
        }
        
        // Initialize dashboard visibility
        setHiddenFromDashboard(!!fiscalData?.hiddenFromDashboard);
        
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
        console.error("Error fetching fiscal data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données fiscales",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFiscalData();
  }, [selectedClient, toast]);
  
  // Handle obligation status changes - fixing the parameter structure
  const handleStatusChange = useCallback((
    obligationType: keyof ObligationStatuses,
    status: any
  ) => {
    setObligationStatuses(prev => ({
      ...prev,
      [obligationType]: status
    }));
  }, []);
  
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
  
  // Handle alert visibility toggle
  const handleToggleAlert = useCallback((checked: boolean) => {
    setShowInAlert(checked);
  }, []);
  
  // Handle dashboard visibility toggle
  const handleToggleDashboardVisibility = useCallback((checked: boolean) => {
    setHiddenFromDashboard(checked);
  }, []);
  
  // Save fiscal data changes
  const handleSave = useCallback(async () => {
    if (!selectedClient?.id) return;
    
    // S'assurer que etablissements est toujours un tableau avant l'enregistrement
    const safeIgsData = {
      ...igsData,
      etablissements: Array.isArray(igsData.etablissements) ? [...igsData.etablissements] : []
    };
    
    console.log("Saving safe IGS data with etablissements:", safeIgsData.etablissements);
    
    const fiscalData = prepareFiscalData(
      creationDate,
      validityEndDate,
      showInAlert,
      obligationStatuses,
      hiddenFromDashboard,
      safeIgsData
    );
    
    console.log("Saving fiscal data:", fiscalData);
    
    try {
      await mutateAsync({
        id: selectedClient.id,
        updates: {
          fiscal_data: fiscalData,
          // Update the igs object for backward compatibility
          igs: extractClientIGSData(safeIgsData)
        }
      });
      
      console.log("Fiscal data saved successfully");
      toast({
        title: "Succès",
        description: "Données fiscales enregistrées avec succès",
      });
    } catch (error) {
      console.error("Error saving fiscal data:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les données fiscales",
        variant: "destructive"
      });
    }
  }, [
    selectedClient?.id,
    creationDate,
    validityEndDate,
    showInAlert,
    obligationStatuses,
    hiddenFromDashboard,
    igsData,
    mutateAsync,
    toast
  ]);
  
  return {
    creationDate,
    setCreationDate,
    validityEndDate,
    obligationStatuses,
    handleStatusChange,
    handleSave,
    isLoading,
    showInAlert,
    handleToggleAlert,
    hiddenFromDashboard,
    handleToggleDashboardVisibility,
    igsData,
    handleIGSChange
  };
}
