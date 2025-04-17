import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

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
 * Check if fiscal data is properly saved by stringifying and comparing
 */
const compareObjects = (obj1: any, obj2: any): boolean => {
  try {
    // Comparison using stringification with sorted keys
    const sortedStringify = (obj: any) => JSON.stringify(obj, Object.keys(obj).sort());
    
    // Remove metadata fields for comparison
    const obj1ForComparison = { ...obj1 };
    const obj2ForComparison = { ...obj2 };
    
    if (obj1ForComparison._metadata) delete obj1ForComparison._metadata;
    if (obj2ForComparison._metadata) delete obj2ForComparison._metadata;
    
    return sortedStringify(obj1ForComparison) === sortedStringify(obj2ForComparison);
  } catch (e) {
    console.error("Error comparing objects:", e);
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
 * Verify main fields of fiscal data
 */
const verifyMainFields = (savedData: ClientFiscalData, expectedData: ClientFiscalData): boolean => {
  if (savedData.hiddenFromDashboard !== expectedData.hiddenFromDashboard) {
    console.error(`Mismatch in hiddenFromDashboard: saved=${savedData.hiddenFromDashboard}, expected=${expectedData.hiddenFromDashboard}`);
    return false;
  }
  
  // Check updatedAt only if it exists in expected data
  if (expectedData.updatedAt) {
    if (!savedData.updatedAt) {
      console.error("Missing updatedAt timestamp in saved data");
      return false;
    }
  }
  
  return true;
};

/**
 * Verify all obligations
 */
const verifyObligations = (
  savedObligations: ClientFiscalData['obligations'], 
  expectedObligations: ClientFiscalData['obligations']
): boolean => {
  const obligationTypes = ['patente', 'igs', 'bail', 'taxeFonciere', 'dsf', 'darp'] as const;
  
  for (const type of obligationTypes) {
    // Vérifier si le type d'obligation existe
    if (expectedObligations[type]) {
      if (!savedObligations[type]) {
        console.error(`Missing obligation type ${type} in saved data`);
        return false;
      }
      
      const saved = savedObligations[type];
      const expected = expectedObligations[type];
      
      // Vérifier status assujetti
      if (saved.assujetti !== expected.assujetti) {
        console.error(`Mismatch in ${type}.assujetti: saved=${saved.assujetti}, expected=${expected.assujetti}`);
        return false;
      }
      
      // Vérifier paye pour les taxes
      if ('paye' in expected && 'paye' in saved) {
        if (saved.paye !== expected.paye) {
          console.error(`Mismatch in ${type}.paye: saved=${saved.paye}, expected=${expected.paye}`);
          return false;
        }
      }
      
      // Vérifier depose pour les déclarations
      if ('depose' in expected && 'depose' in saved) {
        if (saved.depose !== expected.depose) {
          console.error(`Mismatch in ${type}.depose: saved=${saved.depose}, expected=${expected.depose}`);
          return false;
        }
      }
    }
  }
  
  return true;
};

/**
 * Verify attestation data
 */
const verifyAttestation = (
  savedAttestation: ClientFiscalData['attestation'],
  expectedAttestation: ClientFiscalData['attestation']
): boolean => {
  if (!savedAttestation && !expectedAttestation) {
    return true;
  }
  
  if (!savedAttestation || !expectedAttestation) {
    console.error("One of attestation objects is missing");
    return false;
  }
  
  if (savedAttestation.creationDate !== expectedAttestation.creationDate) {
    console.error(`Mismatch in attestation.creationDate: saved=${savedAttestation.creationDate}, expected=${expectedAttestation.creationDate}`);
    return false;
  }
  
  if (savedAttestation.validityEndDate !== expectedAttestation.validityEndDate) {
    console.error(`Mismatch in attestation.validityEndDate: saved=${savedAttestation.validityEndDate}, expected=${expectedAttestation.validityEndDate}`);
    return false;
  }
  
  if (savedAttestation.showInAlert !== expectedAttestation.showInAlert) {
    console.error(`Mismatch in attestation.showInAlert: saved=${savedAttestation.showInAlert}, expected=${expectedAttestation.showInAlert}`);
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
