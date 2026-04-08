
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { compareObjects } from "./verification/compareUtils";
import { verifyMainFields, verifyObligations } from "./verification/obligationsVerifier";
import { verifyAttestation } from "./verification/attestationVerifier";

/**
 * Verify that fiscal data was saved correctly with enhanced checking
 */
export const verifyFiscalDataSave = async (clientId: string, expectedData: ClientFiscalData): Promise<boolean> => {
  try {
    
    // Pause for database consistency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();
    
    if (error) {
      return false;
    }
    
    if (!data?.fiscal_data) {
      return false;
    }
    
    const savedData = data.fiscal_data as unknown as ClientFiscalData;
    
    // Vérification complète de toutes les données fiscales
    return verifyAllFiscalData(savedData, expectedData);
  } catch (error) {
    return false;
  }
};

/**
 * Perform a deep verification of all fiscal data fields
 */
const verifyAllFiscalData = (savedData: ClientFiscalData, expectedData: ClientFiscalData): boolean => {
  // Vérification rapide par comparaison JSON
  const quickCheck = compareObjects(savedData, expectedData);
  if (quickCheck) {
    return true;
  }
  
  
  // Vérifier les champs principaux
  const mainFieldsValid = verifyMainFields(savedData, expectedData);
  if (!mainFieldsValid) {
    return false;
  }
  
  // Vérifier les obligations fiscales
  const obligationsValid = verifyObligations(savedData.obligations, expectedData.obligations);
  if (!obligationsValid) {
    return false;
  }
  
  // Vérifier les données d'attestation
  const attestationValid = verifyAttestation(savedData, expectedData);
  if (!attestationValid) {
    return false;
  }
  
  return true;
};

/**
 * Verify all fiscal modifications for the client and display a toast with the result
 */
export const verifyAndNotifyFiscalChanges = async (clientId: string, expectedData: ClientFiscalData): Promise<boolean> => {
  const isVerified = await verifyFiscalDataSave(clientId, expectedData);
  
  if (isVerified) {
    toast.success("✅ Les modifications fiscales ont été enregistrées définitivement dans la base de données.", {
      duration: 5000
    });
  } else {
    toast.error("❌ Certaines modifications n'ont pas été enregistrées correctement. Nouvelle tentative en cours...", {
      duration: 3000
    });
    
    // Nouvelle tentative après un délai
    await new Promise(resolve => setTimeout(resolve, 2000));
    const secondVerification = await verifyFiscalDataSave(clientId, expectedData);
    
    if (secondVerification) {
      toast.success("✅ Les modifications ont été vérifiées et enregistrées définitivement.", {
        duration: 5000
      });
      return true;
    }
  }
  
  return isVerified;
};
