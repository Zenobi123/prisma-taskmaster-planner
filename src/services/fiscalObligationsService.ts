
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "@/services/client/clientDataMapper";

// Fonction pour déterminer si un client devrait être assujetti selon les règles par défaut
const shouldClientBeSubjectToObligation = (client: Client, obligationType: string): boolean => {
  // Règles pour les personnes physiques
  if (client.type === "physique") {
    if (obligationType === "igs" && client.regimefiscal === "igs") {
      return true;
    }
    if (obligationType === "patente" && client.regimefiscal === "reel") {
      return true;
    }
    if (obligationType === "dsf" && (client.regimefiscal === "reel" || client.regimefiscal === "igs")) {
      return true; // DSF automatique pour les assujettis IGS/Patente
    }
    if (obligationType === "darp") {
      return true; // Toutes les personnes physiques sont assujetties à la DARP
    }
  }
  
  // Règles pour les personnes morales
  if (client.type === "morale") {
    if (obligationType === "igs" && client.regimefiscal === "igs") {
      return true;
    }
    if (obligationType === "patente" && client.regimefiscal === "reel") {
      return true;
    }
    if (obligationType === "dsf" && (client.regimefiscal === "reel" || client.regimefiscal === "igs")) {
      return true; // DSF automatique pour les assujettis IGS/Patente
    }
  }
  
  return false;
};

export const getClientsWithUnpaidIgs = async (): Promise<Client[]> => {
  try {
    console.log("Fetching clients with unpaid IGS from fiscal_data...");
    
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    if (!clientsData) return [];

    // Map raw client data to Client type
    const clients = clientsData.map(mapClientRowToClient);

    const unpaidIgsClients = clients.filter(client => {
      try {
        // Vérifier d'abord si le client devrait être assujetti à l'IGS
        const shouldBeSubject = shouldClientBeSubjectToObligation(client, "igs");
        if (!shouldBeSubject) {
          return false;
        }

        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return true; // Devrait être assujetti mais pas de données = non payé
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligations = non payé
        }

        const igsObligation = yearObligations.igs;
        
        if (!igsObligation || typeof igsObligation !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligation IGS = non payé
        }

        // Client avec IGS non payée : assujetti = true ET payee = false
        const isSubjectToIgs = igsObligation.assujetti === true;
        const isIgsPaid = igsObligation.payee === true;

        return isSubjectToIgs && !isIgsPaid;
      } catch (error) {
        console.error(`Error processing client ${client.id}:`, error);
        return false;
      }
    });

    console.log(`Found ${unpaidIgsClients.length} clients with unpaid IGS`);
    return unpaidIgsClients;
    
  } catch (error) {
    console.error('Error in getClientsWithUnpaidIgs:', error);
    return [];
  }
};

export const getClientsWithUnpaidPatente = async (): Promise<Client[]> => {
  try {
    console.log("Fetching clients with unpaid Patente from fiscal_data...");
    
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    if (!clientsData) return [];

    // Map raw client data to Client type
    const clients = clientsData.map(mapClientRowToClient);

    const unpaidPatenteClients = clients.filter(client => {
      try {
        // Vérifier d'abord si le client devrait être assujetti à la Patente
        const shouldBeSubject = shouldClientBeSubjectToObligation(client, "patente");
        if (!shouldBeSubject) {
          return false;
        }

        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return true; // Devrait être assujetti mais pas de données = non payé
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligations = non payé
        }

        const patenteObligation = yearObligations.patente;
        
        if (!patenteObligation || typeof patenteObligation !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligation Patente = non payé
        }

        // Client avec Patente non payée : assujetti = true ET payee = false
        const isSubjectToPatente = patenteObligation.assujetti === true;
        const isPatentePaid = patenteObligation.payee === true;

        return isSubjectToPatente && !isPatentePaid;
      } catch (error) {
        console.error(`Error processing client ${client.id}:`, error);
        return false;
      }
    });

    console.log(`Found ${unpaidPatenteClients.length} clients with unpaid Patente`);
    return unpaidPatenteClients;
    
  } catch (error) {
    console.error('Error in getClientsWithUnpaidPatente:', error);
    return [];
  }
};

export const getClientsWithUnfiledDsf = async (): Promise<Client[]> => {
  try {
    console.log("Fetching clients with unfiled DSF from fiscal_data...");
    
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    if (!clientsData) return [];

    // Map raw client data to Client type
    const clients = clientsData.map(mapClientRowToClient);

    const unfiledDsfClients = clients.filter(client => {
      try {
        // Vérifier d'abord si le client devrait être assujetti à la DSF
        const shouldBeSubject = shouldClientBeSubjectToObligation(client, "dsf");
        if (!shouldBeSubject) {
          return false;
        }

        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return true; // Devrait être assujetti mais pas de données = non déposé
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligations = non déposé
        }

        const dsfObligation = yearObligations.dsf;
        
        if (!dsfObligation || typeof dsfObligation !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligation DSF = non déposé
        }

        // Client avec DSF non déposée : assujetti = true ET depose = false
        const isSubjectToDsf = dsfObligation.assujetti === true;
        const isDsfFiled = dsfObligation.depose === true;

        return isSubjectToDsf && !isDsfFiled;
      } catch (error) {
        console.error(`Error processing client ${client.id}:`, error);
        return false;
      }
    });

    console.log(`Found ${unfiledDsfClients.length} clients with unfiled DSF`);
    return unfiledDsfClients;
    
  } catch (error) {
    console.error('Error in getClientsWithUnfiledDsf:', error);
    return [];
  }
};

export const getClientsWithUnfiledDarp = async (): Promise<Client[]> => {
  try {
    console.log("Fetching clients with unfiled DARP from fiscal_data...");
    
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    if (!clientsData) return [];

    // Map raw client data to Client type
    const clients = clientsData.map(mapClientRowToClient);

    const unfiledDarpClients = clients.filter(client => {
      try {
        // Vérifier d'abord si le client devrait être assujetti à la DARP
        const shouldBeSubject = shouldClientBeSubjectToObligation(client, "darp");
        if (!shouldBeSubject) {
          return false;
        }

        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return true; // Devrait être assujetti mais pas de données = non déposé
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligations = non déposé
        }

        const darpObligation = yearObligations.darp;
        
        if (!darpObligation || typeof darpObligation !== 'object') {
          return true; // Devrait être assujetti mais pas d'obligation DARP = non déposé
        }

        // Client avec DARP non déposée : assujetti = true ET depose = false
        const isSubjectToDarp = darpObligation.assujetti === true;
        const isDarpFiled = darpObligation.depose === true;

        return isSubjectToDarp && !isDarpFiled;
      } catch (error) {
        console.error(`Error processing client ${client.id}:`, error);
        return false;
      }
    });

    console.log(`Found ${unfiledDarpClients.length} clients with unfiled DARP`);
    return unfiledDarpClients;
    
  } catch (error) {
    console.error('Error in getClientsWithUnfiledDarp:', error);
    return [];
  }
};
