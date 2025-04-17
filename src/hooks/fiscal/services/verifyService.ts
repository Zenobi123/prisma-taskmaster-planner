import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData } from "../types";
import { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

/**
 * Verify that fiscal data was saved correctly
 */
export const verifyFiscalDataSave = async (clientId: string, expectedData: ClientFiscalData): Promise<boolean> => {
  try {
    console.log(`Verifying fiscal data save for client ${clientId}`);
    
    const { data, error } = await supabase
      .from('clients')
      .select('fiscal_data')
      .eq('id', clientId)
      .single();
    
    if (error) {
      console.error("Error during save verification:", error);
      return false;
    }
    
    if (data?.fiscal_data) {
      const savedData = data.fiscal_data as unknown as ClientFiscalData;
      
      // Vérification complète de toutes les données fiscales
      return verifyAllFiscalData(savedData, expectedData);
    }
    
    return false;
  } catch (error) {
    console.error("Exception during save verification:", error);
    return false;
  }
};

/**
 * Perform a deep verification of all fiscal data fields
 */
const verifyAllFiscalData = (savedData: ClientFiscalData, expectedData: ClientFiscalData): boolean => {
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
  return savedData.hiddenFromDashboard === expectedData.hiddenFromDashboard;
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
    if (savedObligations[type] && expectedObligations[type]) {
      const saved = savedObligations[type];
      const expected = expectedObligations[type];
      
      // Vérifier status assujetti
      if (saved.assujetti !== expected.assujetti) {
        console.error(`Mismatch in ${type}.assujetti: saved=${saved.assujetti}, expected=${expected.assujetti}`);
        return false;
      }
      
      // Vérifier paye pour les taxes
      if ('paye' in saved && 'paye' in expected) {
        if (saved.paye !== expected.paye) {
          console.error(`Mismatch in ${type}.paye: saved=${saved.paye}, expected=${expected.paye}`);
          return false;
        }
      }
      
      // Vérifier depose pour les déclarations
      if ('depose' in saved && 'depose' in expected) {
        if (saved.depose !== expected.depose) {
          console.error(`Mismatch in ${type}.depose: saved=${saved.depose}, expected=${expected.depose}`);
          return false;
        }
      }
    } else if (expectedObligations[type] && !savedObligations[type]) {
      console.error(`Missing obligation type ${type} in saved data`);
      return false;
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
  if (!savedAttestation || !expectedAttestation) {
    return !savedAttestation === !expectedAttestation;
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
    toast.success("✅ Les modifications fiscales ont été enregistrées définitivement dans la base de données.", {
      duration: 5000
    });
  } else {
    toast.error("❌ Certaines modifications n'ont pas été enregistrées correctement. Nouvelle tentative en cours...", {
      duration: 3000
    });
  }
  
  return isVerified;
};
