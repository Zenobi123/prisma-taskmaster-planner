
import { supabase } from "@/integrations/supabase/client";
import { Facture, Prestation } from "@/types/facture";
import { Client } from "@/types/client";
import { formatDate } from "@/utils/formatUtils";

// Fetch all factures with related data
export const getFactures = async () => {
  try {
    const { data: facturesData, error: facturesError } = await supabase
      .from("factures")
      .select("*");
      
    if (facturesError) {
      console.error("Error fetching factures:", facturesError);
      throw facturesError;
    }
    
    const { data: clientsData, error: clientsError } = await supabase
      .from("clients")
      .select("*");
      
    if (clientsError) {
      console.error("Error fetching clients:", clientsError);
      throw clientsError;
    }
    
    // Fetch prestations and paiements for each facture
    const facturesWithDetails = await Promise.all(
      facturesData.map(async (facture) => {
        // Find the client for this facture
        const client = clientsData.find((c) => c.id === facture.client_id);
        
        if (!client) {
          console.error(`Client not found for facture: ${facture.id}`);
          return null;
        }
        
        // Fetch prestations
        const { data: prestationsData, error: prestationsError } = await supabase
          .from("prestations")
          .select("*")
          .eq("facture_id", facture.id);
          
        if (prestationsError) {
          console.error(`Error fetching prestations for facture ${facture.id}:`, prestationsError);
          return null;
        }
        
        // Fetch paiements
        const { data: paiementsData, error: paiementsError } = await supabase
          .from("paiements")
          .select("*")
          .eq("facture_id", facture.id);
          
        if (paiementsError) {
          console.error(`Error fetching paiements for facture ${facture.id}:`, paiementsError);
          return null;
        }
        
        // Safely extract address and contact information with proper type checking
        const adresse = typeof client.adresse === 'object' && client.adresse 
          ? client.adresse 
          : { ville: '', quartier: '', lieuDit: '' };

        const contact = typeof client.contact === 'object' && client.contact 
          ? client.contact 
          : { telephone: '', email: '' };
        
        // Create complete facture object with all related data
        const completeFacture: Facture = {
          id: facture.id,
          client_id: facture.client_id,
          client: {
            id: client.id,
            nom: client.type === "physique" ? client.nom || "" : client.raisonsociale || "",
            adresse: typeof adresse === 'object' && 'ville' in adresse ? adresse.ville : "",
            telephone: typeof contact === 'object' && 'telephone' in contact ? contact.telephone : "",
            email: typeof contact === 'object' && 'email' in contact ? contact.email : ""
          },
          date: formatDate(facture.date),
          echeance: formatDate(facture.echeance),
          montant: facture.montant,
          montant_paye: facture.montant_paye || 0,
          status: facture.status as "en_attente" | "envoyée" | "payée" | "partiellement_payée" | "annulée",
          mode_paiement: facture.mode_paiement || "espèces",
          prestations: prestationsData || [],
          paiements: paiementsData || [],
          notes: facture.notes,
          created_at: facture.created_at,
          updated_at: facture.updated_at,
        };
        
        return completeFacture;
      })
    );
    
    // Filter out any null values (factures that failed to load properly)
    const validFactures = facturesWithDetails.filter(f => f !== null) as Facture[];
    
    return validFactures;
  } catch (error) {
    console.error("Error in getFactures:", error);
    throw error;
  }
};

// Format clients for client selector
export const formatClientsForSelector = (clientsData: any[]): Client[] => {
  return clientsData.map(client => {
    // Safely extract address and contact information
    const adresse = typeof client.adresse === 'object' && client.adresse 
      ? client.adresse 
      : { ville: '', quartier: '', lieuDit: '' };

    const contact = typeof client.contact === 'object' && client.contact 
      ? client.contact 
      : { telephone: '', email: '' };

    return {
      id: client.id,
      nom: client.type === "physique" ? client.nom || "" : client.raisonsociale || "",
      adresse: typeof adresse === 'object' && 'ville' in adresse ? adresse.ville : "",
      telephone: typeof contact === 'object' && 'telephone' in contact ? contact.telephone : "",
      email: typeof contact === 'object' && 'email' in contact ? contact.email : "",
      type: client.type,
      niu: client.niu,
      centrerattachement: client.centrerattachement,
      secteuractivite: client.secteuractivite,
      statut: client.statut,
      interactions: client.interactions || [],
      contact: contact,
      gestionexternalisee: client.gestionexternalisee || false,
    } as Client;
  });
};

// Add a new facture to the database
export const addFactureToDatabase = async (facture: Facture) => {
  try {
    // Add to Supabase database
    const { data: factureData, error: factureError } = await supabase
      .from("factures")
      .insert({
        id: facture.id,
        client_id: facture.client_id,
        date: new Date(facture.date.split('/').reverse().join('-')),
        echeance: new Date(facture.echeance.split('/').reverse().join('-')),
        montant: facture.montant,
        montant_paye: facture.montant_paye || 0,
        status: facture.status,
        notes: facture.notes,
        mode_paiement: facture.mode_paiement
      })
      .select()
      .single();
      
    if (factureError) {
      console.error("Error inserting facture:", factureError);
      throw factureError;
    }
    
    // Add prestations
    if (facture.prestations && facture.prestations.length > 0) {
      const prestationsToInsert = facture.prestations.map(prestation => ({
        facture_id: facture.id,
        description: prestation.description,
        quantite: prestation.quantite || 1,
        montant: prestation.montant,
        taux: prestation.taux || 0
      }));
      
      const { error: prestationsError } = await supabase
        .from("prestations")
        .insert(prestationsToInsert);
        
      if (prestationsError) {
        console.error("Error inserting prestations:", prestationsError);
        throw prestationsError;
      }
    }
    
    return factureData;
  } catch (error) {
    console.error("Error in addFactureToDatabase:", error);
    throw error;
  }
};
