
import { supabase } from "@/integrations/supabase/client";
import { Facture } from "@/types/facture";
import { formatDate } from "@/utils/formatUtils";

// Fetch all factures with related data
export const getFacturesData = async () => {
  try {
    const { data: facturesData, error: facturesError } = await supabase
      .from("factures")
      .select("*");
      
    if (facturesError) {
      console.error("Error fetching factures:", facturesError);
      throw new Error(`Failed to fetch invoices: ${facturesError.message}`);
    }
    
    const { data: clientsData, error: clientsError } = await supabase
      .from("clients")
      .select("*");
      
    if (clientsError) {
      console.error("Error fetching clients:", clientsError);
      throw new Error(`Failed to fetch clients: ${clientsError.message}`);
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
          throw new Error(`Failed to fetch services for invoice ${facture.id}: ${prestationsError.message}`);
        }
        
        // Fetch paiements
        const { data: paiementsData, error: paiementsError } = await supabase
          .from("paiements")
          .select("*")
          .eq("facture_id", facture.id);
          
        if (paiementsError) {
          console.error(`Error fetching paiements for facture ${facture.id}:`, paiementsError);
          throw new Error(`Failed to fetch payments for invoice ${facture.id}: ${paiementsError.message}`);
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
            adresse: typeof adresse === 'object' && 'ville' in adresse ? adresse.ville as string : "",
            telephone: typeof contact === 'object' && 'telephone' in contact ? contact.telephone as string : "",
            email: typeof contact === 'object' && 'email' in contact ? contact.email as string : ""
          },
          date: formatDate(facture.date),
          echeance: formatDate(facture.echeance),
          montant: facture.montant,
          montant_paye: facture.montant_paye || 0,
          status: facture.status as "en_attente" | "envoyée" | "payée" | "partiellement_payée" | "annulée",
          mode_paiement: facture.mode_paiement as string || "espèces",
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
    console.error("Error in getFacturesData:", error);
    // Provide a more user-friendly error message
    if (error instanceof Error) {
      throw new Error(`Failed to retrieve invoices: ${error.message}`);
    } else {
      throw new Error("An unexpected error occurred while retrieving invoices");
    }
  }
};
