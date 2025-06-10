
import { useCallback } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses } from "./types";
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
        // Conversion sécurisée avec validation des types
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
          // IGS-specific fields avec validation améliorée
          ...(('caValue' in obligation) && obligation.caValue !== undefined && { caValue: Number(obligation.caValue) || 0 }),
          ...(('isCGA' in obligation) && obligation.isCGA !== undefined && { isCGA: Boolean(obligation.isCGA) }),
          ...(('classe' in obligation) && obligation.classe !== undefined && { classe: obligation.classe }),
          ...(('q1Payee' in obligation) && obligation.q1Payee !== undefined && { q1Payee: Boolean(obligation.q1Payee) }),
          ...(('q2Payee' in obligation) && obligation.q2Payee !== undefined && { q2Payee: Boolean(obligation.q2Payee) }),
          ...(('q3Payee' in obligation) && obligation.q3Payee !== undefined && { q3Payee: Boolean(obligation.q3Payee) }),
          ...(('q4Payee' in obligation) && obligation.q4Payee !== undefined && { q4Payee: Boolean(obligation.q4Payee) }),
          // IGS quarterly payment amounts
          ...(('q1Amount' in obligation) && obligation.q1Amount !== undefined && { q1Amount: Number(obligation.q1Amount) || 0 }),
          ...(('q2Amount' in obligation) && obligation.q2Amount !== undefined && { q2Amount: Number(obligation.q2Amount) || 0 }),
          ...(('q3Amount' in obligation) && obligation.q3Amount !== undefined && { q3Amount: Number(obligation.q3Amount) || 0 }),
          ...(('q4Amount' in obligation) && obligation.q4Amount !== undefined && { q4Amount: Number(obligation.q4Amount) || 0 }),
          // IGS quarterly payment dates
          ...(('q1Date' in obligation) && obligation.q1Date && { q1Date: obligation.q1Date }),
          ...(('q2Date' in obligation) && obligation.q2Date && { q2Date: obligation.q2Date }),
          ...(('q3Date' in obligation) && obligation.q3Date && { q3Date: obligation.q3Date }),
          ...(('q4Date' in obligation) && obligation.q4Date && { q4Date: obligation.q4Date })
        };
      }
    });

    return prepared as Json;
  }, []);

  // Fonction pour sauvegarder les modifications avec retry et validation
  const saveChanges = useCallback(async () => {
    if (!selectedClient?.id) {
      toast.error("Impossible de sauvegarder : client non sélectionné");
      return false;
    }

    let saveSuccess = false;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setIsSaving(true);
        console.log(`=== TENTATIVE DE SAUVEGARDE ${attempt}/${maxRetries} ===`);
        console.log("Client ID:", selectedClient.id);
        console.log("Année fiscale:", fiscalYear);
        console.log("Obligations à sauvegarder:", obligationStatuses);
        
        // Récupérer les données fiscales existantes avec gestion d'erreur
        const { data: existingClient, error: fetchError } = await supabase
          .from("clients")
          .select("fiscal_data")
          .eq("id", selectedClient.id)
          .single();

        if (fetchError) {
          console.error(`Erreur lors de la récupération (tentative ${attempt}):`, fetchError);
          if (attempt === maxRetries) {
            toast.error("Erreur lors de la récupération des données existantes");
            return false;
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        console.log("Données fiscales existantes:", existingClient?.fiscal_data);

        const existingFiscalData = existingClient?.fiscal_data || {};
        
        // Préparer les nouvelles données avec validation complète
        const fiscalDataToSave = {
          clientId: selectedClient.id,
          year: fiscalYear,
          attestation: {
            creationDate: creationDate || "",
            validityEndDate: validityEndDate || "",
            showInAlert: Boolean(showInAlert)
          },
          obligations: {
            ...(existingFiscalData as any)?.obligations,
            [fiscalYear]: prepareObligationsForSave(obligationStatuses)
          },
          hiddenFromDashboard: Boolean(hiddenFromDashboard),
          selectedYear: fiscalYear,
          lastSaved: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        console.log("Données fiscales préparées pour sauvegarde:", fiscalDataToSave);

        // Convertir en format Json compatible avec validation
        const jsonCompatibleData = convertToJsonCompatible(fiscalDataToSave);
        console.log("Données compatibles JSON:", jsonCompatibleData);

        // Sauvegarder dans Supabase avec retry
        const { error: saveError } = await supabase
          .from("clients")
          .update({
            fiscal_data: jsonCompatibleData
          })
          .eq("id", selectedClient.id);

        if (saveError) {
          console.error(`Erreur lors de la sauvegarde (tentative ${attempt}):`, saveError);
          if (attempt === maxRetries) {
            toast.error(`Erreur lors de la sauvegarde: ${saveError.message}`);
            return false;
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        console.log("=== SAUVEGARDE RÉUSSIE ===");

        // Vérification post-sauvegarde obligatoire
        const { data: verificationData, error: verificationError } = await supabase
          .from("clients")
          .select("fiscal_data")
          .eq("id", selectedClient.id)
          .single();

        if (verificationError) {
          console.warn("Erreur lors de la vérification:", verificationError);
        } else {
          console.log("Vérification - Données sauvegardées:", verificationData?.fiscal_data);
          
          // Vérifier que les données ont bien été sauvegardées
          const savedObligations = verificationData?.fiscal_data?.obligations?.[fiscalYear];
          if (!savedObligations) {
            console.error("Les obligations n'ont pas été sauvegardées correctement");
            if (attempt === maxRetries) {
              toast.error("Erreur: les données n'ont pas été sauvegardées correctement");
              return false;
            }
            continue;
          }
        }

        // Invalider le cache des clients pour forcer le rechargement
        invalidateClientsCache();

        setHasUnsavedChanges(false);
        toast.success("Données fiscales sauvegardées avec succès");
        saveSuccess = true;
        break;
        
      } catch (error) {
        console.error(`Exception lors de la sauvegarde (tentative ${attempt}):`, error);
        if (attempt === maxRetries) {
          toast.error("Erreur inattendue lors de la sauvegarde");
          return false;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } finally {
        if (attempt === maxRetries || saveSuccess) {
          setIsSaving(false);
        }
      }
    }
    
    return saveSuccess;
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
