
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

export const getClientsWithUnpaidIgs = async (): Promise<Client[]> => {
  try {
    console.log("Fetching clients with unpaid IGS from fiscal_data...");
    
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    if (!clients) return [];

    const unpaidIgsClients = clients.filter(client => {
      try {
        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return false;
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          return false;
        }

        const igsObligation = yearObligations.igs;
        
        if (!igsObligation || typeof igsObligation !== 'object') {
          return false;
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
    
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    if (!clients) return [];

    const unpaidPatenteClients = clients.filter(client => {
      try {
        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return false;
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          return false;
        }

        const patenteObligation = yearObligations.patente;
        
        if (!patenteObligation || typeof patenteObligation !== 'object') {
          return false;
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
    
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    if (!clients) return [];

    const unfiledDsfClients = clients.filter(client => {
      try {
        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return false;
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          return false;
        }

        const dsfObligation = yearObligations.dsf;
        
        if (!dsfObligation || typeof dsfObligation !== 'object') {
          return false;
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
    
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    if (!clients) return [];

    const unfiledDarpClients = clients.filter(client => {
      try {
        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          return false;
        }

        const fiscalData = client.fiscal_data as any;
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          return false;
        }

        const darpObligation = yearObligations.darp;
        
        if (!darpObligation || typeof darpObligation !== 'object') {
          return false;
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
