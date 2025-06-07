
import { useCallback } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses, ObligationType } from "./types";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { invalidateClientsCache } from "@/services/clientService";

interface UseFiscalDataSaveProps {
  selectedClient: Client;
  fiscalYear: string;
  creationDate: string;
  validityEndDate: string;
  showInAlert: boolean;
  hiddenFromDashboard: boolean;
  obligationStatuses: ObligationStatuses;
  setIsSaving: (saving: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export const useFiscalDataSave = ({
  selectedClient,
  fiscalYear,
  creationDate,
  validityEndDate,
  showInAlert,
  hiddenFromDashboard,
  obligationStatuses,
  setIsSaving,
  setHasUnsavedChanges
}: UseFiscalDataSaveProps) => {
  // Fonction pour convertir les données en format Json compatible
  const convertToJsonCompatible = useCallback((data: any): Json => {
    const convertValue = (value: any): Json => {
      if (value === null || value === undefined) {
        return null;
      }
      if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
        return value;
      }
      if (Array.isArray(value)) {
        return value.map(convertValue) as Json[];
      }
      if (typeof value === 'object') {
        const result: { [key: string]: Json } = {};
        Object.keys(value).forEach(key => {
          result[key] = convertValue(value[key]);
        });
        return result;
      }
      return String(value);
    };
    
    return convertValue(data);
  }, []);

  // Fonction pour sauvegarder les modifications de manière persistante
  const saveChanges = useCallback(async () => {
    if (!selectedClient?.id) {
      toast.error("Impossible de sauvegarder : client non sélectionné");
      return;
    }

    try {
      setIsSaving(true);
      
      // Préparer les données à sauvegarder
      const fiscalDataToSave = {
        clientId: selectedClient.id,
        year: fiscalYear,
        attestation: {
          creationDate,
          validityEndDate,
          showInAlert
        },
        obligations: {
          [fiscalYear]: obligationStatuses
        },
        hiddenFromDashboard,
        selectedYear: fiscalYear,
        updatedAt: new Date().toISOString()
      };

      // Convertir en format Json compatible
      const jsonCompatibleData = convertToJsonCompatible(fiscalDataToSave);

      // Sauvegarder dans Supabase
      const { error } = await supabase
        .from("clients")
        .update({
          fiscal_data: jsonCompatibleData
        })
        .eq("id", selectedClient.id);

      if (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        toast.error("Erreur lors de la sauvegarde des données fiscales");
        return;
      }

      // Invalider le cache des clients pour forcer le rechargement
      invalidateClientsCache();

      setHasUnsavedChanges(false);
      toast.success("Données fiscales sauvegardées avec succès");
      
    } catch (error) {
      console.error("Exception lors de la sauvegarde:", error);
      toast.error("Erreur inattendue lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  }, [
    selectedClient,
    fiscalYear,
    creationDate,
    validityEndDate,
    showInAlert,
    hiddenFromDashboard,
    obligationStatuses,
    setIsSaving,
    setHasUnsavedChanges,
    convertToJsonCompatible
  ]);

  return { saveChanges };
};
