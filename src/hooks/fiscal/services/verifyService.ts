
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
    console.log(`Verifying fiscal data save for client ${clientId}`);
    
    // Pause for database consistency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error("Error during save verification:", error);
      return false;
    }
    
    if (!data?.fiscal_data) {
      console.error("No fiscal data found during verification");
      return false;
    }
    
    const savedData = data.fiscal_data as unknown as ClientFiscalData;
    
    // Vérification complète de toutes les données fiscales
    return verifyAllFiscalData(savedData, expectedData);
  } catch (error) {
    console.error("Exception during save verification:", error);
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
    console.log("Quick verification passed - objects match");
    return true;
  }
  
  console.log("Quick verification failed - performing detailed checks");
  
  // Vérifier les champs principaux
  const mainFieldsValid = verifyMainFields(savedData, expectedData);
  if (!mainFieldsValid) {
    console.error("Main fiscal data fields verification failed");
    return false;
  }
  
  // Vérifier les obligations fiscales
  const obligationsValid = verifyObligations(savedData.obligations, expectedData.obligations);
  if (!obligationsValid) {
    console.error("Obligations verification failed");
    return false;
  }
  
  // Vérifier les données d'attestation
  const attestationValid = verifyAttestation(savedData.attestation, expectedData.attestation);
  if (!attestationValid) {
    console.error("Attestation verification failed");
    return false;
  }
  
  console.log("All fiscal data verified successfully");
  return true;
};

/**
 * Verify all fiscal modifications for the client and display a toast with the result
 */
export const verifyAndNotifyFiscalChanges = async (clientId: string, expectedData: ClientFiscalData): Promise<boolean> => {
  const isVerified = await verifyFiscalDataSave(clientId, expectedData);
  
  if (isVerified) {
    console.log(`Modifications fiscales vérifiées et confirmées pour le client ${clientId}`);
    toast.success("✅ Les modifications fiscales ont été enregistrées définitivement dans la base de données.", {
      duration: 5000
    });
  } else {
    console.error(`Échec de la vérification des modifications fiscales pour le client ${clientId}`);
    toast.error("❌ Certaines modifications n'ont pas été enregistrées correctement. Nouvelle tentative en cours...", {
      duration: 3000
    });
    
    // Nouvelle tentative après un délai
    await new Promise(resolve => setTimeout(resolve, 2000));
    const secondVerification = await verifyFiscalDataSave(clientId, expectedData);
    
    if (secondVerification) {
      console.log(`Seconde vérification réussie pour le client ${clientId}`);
      toast.success("✅ Les modifications ont été vérifiées et enregistrées définitivement.", {
        duration: 5000
      });
      return true;
    }
  }
  
  return isVerified;
};
