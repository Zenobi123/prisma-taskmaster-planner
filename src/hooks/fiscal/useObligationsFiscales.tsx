
import { useState, useEffect, useCallback } from "react";
import { Client } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { useUpdateClientMutation } from "@/pages/clients/hooks/mutations/useUpdateClientMutation";
import { ObligationStatuses, CGAClasse } from "./types";

// Interface pour les valeurs de paiement IGS
interface IGSPayment {
  montant: string;
  quittance: string;
}

// Interface pour les données IGS
interface IGSData {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patente?: IGSPayment;
  acompteJanvier?: IGSPayment;
  acompteFevrier?: IGSPayment;
}

export function useObligationsFiscales(selectedClient: Client) {
  // États pour l'attestation fiscale
  const [creationDate, setCreationDate] = useState("");
  const [validityEndDate, setValidityEndDate] = useState("");
  const [showInAlert, setShowInAlert] = useState(false);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState(false);
  
  // État pour les obligations fiscales
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    patente: { assujetti: false, paye: false },
    bail: { assujetti: false, paye: false },
    taxeFonciere: { assujetti: false, paye: false },
    dsf: { assujetti: false, depose: false },
    darp: { assujetti: false, depose: false },
  });
  
  // État pour les données IGS
  const [igsData, setIgsData] = useState<IGSData>({
    soumisIGS: false,
    adherentCGA: false,
    classeIGS: undefined,
    patente: undefined,
    acompteJanvier: undefined,
    acompteFevrier: undefined
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const { mutateAsync } = useUpdateClientMutation();

  // Charger les données fiscales du client
  useEffect(() => {
    const loadFiscalData = async () => {
      if (!selectedClient?.id) return;
      
      setIsLoading(true);
      console.log("Fetching fiscal data for client", selectedClient.id);
      
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("fiscal_data")
          .eq("id", selectedClient.id)
          .single();
        
        if (error) {
          console.error("Error fetching fiscal data:", error);
          return;
        }
        
        console.log("Fiscal data found for client", selectedClient.id);
        
        // Initialiser les données fiscales si elles existent
        if (data?.fiscal_data && typeof data.fiscal_data === 'object') {
          const fiscalData = data.fiscal_data;
          
          // Initialiser les dates d'attestation
          if (fiscalData.attestation && typeof fiscalData.attestation === 'object') {
            setCreationDate(fiscalData.attestation.creationDate || "");
            setValidityEndDate(fiscalData.attestation.validityEndDate || "");
            setShowInAlert(!!fiscalData.attestation.showInAlert);
          }
          
          // Initialiser les obligations fiscales
          if (fiscalData.obligations && typeof fiscalData.obligations === 'object') {
            setObligationStatuses(fiscalData.obligations);
          }
          
          // Initialiser la visibilité dans le tableau de bord
          setHiddenFromDashboard(!!fiscalData.hiddenFromDashboard);
          
          // Initialiser les données IGS
          if (fiscalData.igs && typeof fiscalData.igs === 'object') {
            setIgsData({
              soumisIGS: fiscalData.igs.soumisIGS || false,
              adherentCGA: fiscalData.igs.adherentCGA || false,
              classeIGS: fiscalData.igs.classeIGS,
              patente: fiscalData.igs.patente,
              acompteJanvier: fiscalData.igs.acompteJanvier,
              acompteFevrier: fiscalData.igs.acompteFevrier
            });
          } else if (selectedClient.igs) {
            // Fallback aux données IGS directement sur le client si nécessaire
            setIgsData({
              soumisIGS: selectedClient.igs.soumisIGS || false,
              adherentCGA: selectedClient.igs.adherentCGA || false,
              classeIGS: selectedClient.igs.classeIGS,
              patente: selectedClient.igs.patente,
              acompteJanvier: selectedClient.igs.acompteJanvier,
              acompteFevrier: selectedClient.igs.acompteFevrier
            });
          }
        } else if (selectedClient.igs) {
          // Fallback si fiscal_data n'existe pas mais igs si
          setIgsData({
            soumisIGS: selectedClient.igs.soumisIGS || false,
            adherentCGA: selectedClient.igs.adherentCGA || false,
            classeIGS: selectedClient.igs.classeIGS,
            patente: selectedClient.igs.patente,
            acompteJanvier: selectedClient.igs.acompteJanvier,
            acompteFevrier: selectedClient.igs.acompteFevrier
          });
        }
      } catch (error) {
        console.error("Error in loadFiscalData:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFiscalData();
  }, [selectedClient]);
  
  // Gérer les changements de statut des obligations
  const handleStatusChange = (
    obligationType: keyof ObligationStatuses,
    statusKey: string,
    value: boolean
  ) => {
    setObligationStatuses(prev => ({
      ...prev,
      [obligationType]: {
        ...prev[obligationType],
        [statusKey]: value
      }
    }));
  };
  
  // Gérer les changements dans les données IGS
  const handleIGSChange = (name: string, value: any) => {
    const parts = name.split('.');
    if (parts[0] === 'igs') {
      setIgsData(prev => ({
        ...prev,
        [parts[1]]: value
      }));
    }
  };
  
  // Gérer la visibilité des alertes
  const handleToggleAlert = (checked: boolean) => {
    setShowInAlert(checked);
  };
  
  // Gérer la visibilité dans le tableau de bord
  const handleToggleDashboardVisibility = (checked: boolean) => {
    setHiddenFromDashboard(checked);
  };
  
  // Enregistrer les modifications
  const handleSave = useCallback(async () => {
    if (!selectedClient?.id) return;
    
    const fiscalData = {
      attestation: {
        creationDate,
        validityEndDate,
        showInAlert
      },
      obligations: obligationStatuses,
      hiddenFromDashboard,
      igs: igsData
    };
    
    try {
      await mutateAsync({
        id: selectedClient.id,
        updates: {
          fiscal_data: fiscalData,
          // Mettre à jour l'objet igs pour compatibilité rétroactive
          igs: {
            soumisIGS: igsData.soumisIGS,
            adherentCGA: igsData.adherentCGA,
            classeIGS: igsData.classeIGS,
            patente: igsData.patente,
            acompteJanvier: igsData.acompteJanvier,
            acompteFevrier: igsData.acompteFevrier
          }
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
