
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "@/services/client/clientDataMapper";

export const getClientsWithUnfiledDsf = async (): Promise<Client[]> => {
  try {
    console.log("Fetching clients with unfiled DSF from fiscal_data...");
    
    // Récupérer tous les clients actifs avec toutes leurs données
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    if (!clientsData || clientsData.length === 0) {
      console.log("No clients found");
      return [];
    }

    console.log(`Found ${clientsData.length} active clients, checking DSF status...`);

    // Map raw client data to Client type
    const clients = clientsData.map(mapClientRowToClient);

    // Filtrer les clients avec DSF non déposées
    const unfiledDsfClients = clients.filter(client => {
      try {
        // Vérifier d'abord si le client devrait être assujetti à la DSF selon les règles par défaut
        const shouldBeSubjectToDsf = shouldClientBeSubjectToDsf(client);
        
        if (!shouldBeSubjectToDsf) {
          return false; // Le client ne devrait pas être assujetti à la DSF
        }

        // Vérifier si le client a des données fiscales
        if (!client.fiscal_data || typeof client.fiscal_data !== 'object') {
          // Si pas de données fiscales mais devrait être assujetti, considérer comme non déposé
          console.log(`Client ${client.nom || client.raisonsociale} should be subject to DSF but has no fiscal data`);
          return true;
        }

        const fiscalData = client.fiscal_data as any;
        
        // Obtenir l'année courante
        const currentYear = new Date().getFullYear().toString();
        const selectedYear = fiscalData.selectedYear || currentYear;
        
        // Vérifier les obligations pour l'année sélectionnée
        const yearObligations = fiscalData.obligations?.[selectedYear];
        
        if (!yearObligations || typeof yearObligations !== 'object') {
          // Si pas d'obligations pour cette année mais devrait être assujetti
          console.log(`Client ${client.nom || client.raisonsociale} should be subject to DSF but has no obligations for year ${selectedYear}`);
          return true;
        }

        // Vérifier le statut DSF
        const dsfObligation = yearObligations.dsf;
        
        if (!dsfObligation || typeof dsfObligation !== 'object') {
          // Si pas d'obligation DSF mais devrait être assujetti
          console.log(`Client ${client.nom || client.raisonsociale} should be subject to DSF but has no DSF obligation`);
          return true;
        }

        // Client avec DSF non déposée : assujetti = true ET depose = false
        const isSubjectToDsf = dsfObligation.assujetti === true;
        const isDsfFiled = dsfObligation.depose === true;

        const shouldInclude = isSubjectToDsf && !isDsfFiled;
        
        if (shouldInclude) {
          console.log(`Client ${client.nom || client.raisonsociale} has unfiled DSF:`, {
            assujetti: dsfObligation.assujetti,
            depose: dsfObligation.depose
          });
        }

        return shouldInclude;
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

// Fonction pour déterminer si un client devrait être assujetti à la DSF selon les règles par défaut
const shouldClientBeSubjectToDsf = (client: Client): boolean => {
  // Règle : Les assujettis à IGS ou Patente sont automatiquement assujettis à la DSF
  
  // Pour les personnes physiques
  if (client.type === "physique") {
    if (client.regimefiscal === "reel" || client.regimefiscal === "igs") {
      return true; // Assujetti à Patente ou IGS donc DSF obligatoire
    }
  }
  
  // Pour les personnes morales
  if (client.type === "morale") {
    if (client.regimefiscal === "reel" || client.regimefiscal === "igs") {
      return true; // Assujetti à Patente ou IGS donc DSF obligatoire
    }
  }
  
  return false;
};
