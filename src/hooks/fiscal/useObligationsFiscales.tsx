
import { useState, useEffect, useCallback } from "react";
import { Client, Etablissement } from "@/types/client";
import { useUpdateClientMutation } from "@/pages/clients/hooks/mutations/useUpdateClientMutation";
import { ObligationStatuses, ClientFiscalData, CGAClasse } from "./types";
import { IGSData } from "./types/igsTypes";
import { loadFiscalData, extractIGSData } from "./utils/loadFiscalData";
import { prepareFiscalData, extractClientIGSData } from "./utils/saveFiscalData";

export function useObligationsFiscales(selectedClient: Client) {
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
        
        // Make sure etablissements is initialized as an array
        if (!extractedIGSData.etablissements) {
          extractedIGSData.etablissements = [];
        }
        
        // Make sure chiffreAffairesAnnuel is initialized
        if (extractedIGSData.chiffreAffairesAnnuel === undefined) {
          extractedIGSData.chiffreAffairesAnnuel = 0;
        }
        
        setIgsData(extractedIGSData);
        
      } catch (error) {
        console.error("Error fetching fiscal data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFiscalData();
  }, [selectedClient]);
  
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
    const parts = name.split('.');
    if (parts[0] === 'igs') {
      setIgsData(prev => ({
        ...prev,
        [parts[1]]: value
      }));
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
    
    const fiscalData = prepareFiscalData(
      creationDate,
      validityEndDate,
      showInAlert,
      obligationStatuses,
      hiddenFromDashboard,
      igsData
    );
    
    try {
      await mutateAsync({
        id: selectedClient.id,
        updates: {
          fiscal_data: fiscalData,
          // Update the igs object for backward compatibility
          igs: extractClientIGSData(igsData)
        }
      });
      
      console.log("Fiscal data saved successfully");
    } catch (error) {
      console.error("Error saving fiscal data:", error);
    }
  }, [
    selectedClient?.id,
    creationDate,
    validityEndDate,
    showInAlert,
    obligationStatuses,
    hiddenFromDashboard,
    igsData,
    mutateAsync
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
