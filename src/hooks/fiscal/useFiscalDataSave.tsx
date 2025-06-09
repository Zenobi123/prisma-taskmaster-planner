
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

  // Fonction pour préparer les obligations pour la sauvegarde
  const prepareObligationsForSave = useCallback((obligations: ObligationStatuses): Json => {
    const prepared: any = {};
    
    Object.keys(obligations).forEach(obligationKey => {
      const obligation = obligations[obligationKey as keyof ObligationStatuses];
      if (obligation) {
        prepared[obligationKey] = {
          assujetti: Boolean(obligation.assujetti),
          attachements: obligation.attachements || {},
          observations: obligation.observations || "",
          // Tax-specific fields
          ...(('payee' in obligation) && { payee: Boolean(obligation.payee) }),
          ...(('dateEcheance' in obligation) && obligation.dateEcheance && { dateEcheance: obligation.dateEcheance }),
          ...(('datePaiement' in obligation) && obligation.datePaiement && { datePaiement: obligation.datePaiement }),
          ...(('montant' in obligation) && obligation.montant !== undefined && { montant: Number(obligation.montant) || 0 }),
          ...(('methodePaiement' in obligation) && obligation.methodePaiement && { methodePaiement: obligation.methodePaiement }),
          ...(('referencePaiement' in obligation) && obligation.referencePaiement && { referencePaiement: obligation.referencePaiement }),
          // Declaration-specific fields
          ...(('depose' in obligation) && { depose: Boolean(obligation.depose) }),
          ...(('periodicity' in obligation) && { periodicity: obligation.periodicity || "annuelle" }),
          ...(('dateDepot' in obligation) && obligation.dateDepot && { dateDepot: obligation.dateDepot }),
          ...(('regime' in obligation) && obligation.regime && { regime: obligation.regime }),
          // IGS-specific fields
          ...(('caValue' in obligation) && obligation.caValue !== undefined && { caValue: Number(obligation.caValue) || 0 }),
          ...(('isCGA' in obligation) && obligation.isCGA !== undefined && { isCGA: Boolean(obligation.isCGA) }),
          ...(('classe' in obligation) && obligation.classe !== undefined && { classe: Number(obligation.classe) || 0 }),
          ...(('q1Payee' in obligation) && obligation.q1Payee !== undefined && { q1Payee: Boolean(obligation.q1Payee) }),
          ...(('q2Payee' in obligation) && obligation.q2Payee !== undefined && { q2Payee: Boolean(obligation.q2Payee) }),
          ...(('q3Payee' in obligation) && obligation.q3Payee !== undefined && { q3Payee: Boolean(obligation.q3Payee) }),
          ...(('q4Payee' in obligation) && obligation.q4Payee !== undefined && { q4Payee: Boolean(obligation.q4Payee) })
        };
      }
    });

    return prepared as Json;
  }, []);

  // Fonction pour sauvegarder les modifications de manière persistante
  const saveChanges = useCallback(async () => {
    if (!selectedClient?.id) {
      toast.error("Impossible de sauvegarder : client non sélectionné");
      return;
    }

    try {
      setIsSaving(true);
      console.log("Début de la sauvegarde des données fiscales pour le client:", selectedClient.id);
      console.log("Données à sauvegarder:", { fiscalYear, obligationStatuses });
      
      // Récupérer les données fiscales existantes
      const { data: existingClient, error: fetchError } = await supabase
        .from("clients")
        .select("fiscal_data")
        .eq("id", selectedClient.id)
        .single();

      if (fetchError) {
        console.error("Erreur lors de la récupération des données existantes:", fetchError);
        toast.error("Erreur lors de la récupération des données existantes");
        return;
      }

      const existingFiscalData = existingClient?.fiscal_data || {};
      
      // Préparer les nouvelles données à sauvegarder
      const fiscalDataToSave = {
        clientId: selectedClient.id,
        year: fiscalYear,
        attestation: {
          creationDate,
          validityEndDate,
          showInAlert
        },
        obligations: {
          ...(existingFiscalData as any)?.obligations,
          [fiscalYear]: prepareObligationsForSave(obligationStatuses)
        },
        hiddenFromDashboard,
        selectedYear: fiscalYear,
        updatedAt: new Date().toISOString()
      };

      console.log("Données fiscales préparées:", fiscalDataToSave);

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

      console.log("Sauvegarde réussie pour le client:", selectedClient.id);

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
    convertToJsonCompatible,
    prepareObligationsForSave
  ]);

  return { saveChanges };
};
