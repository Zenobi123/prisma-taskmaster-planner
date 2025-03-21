
import { supabase } from "@/integrations/supabase/client";
import { Facture } from "@/types/facture";
import { formatDate } from "@/utils/formatUtils";

// Fetch clients data from the database
const getClientsData = async () => {
  const { data: clientsData, error: clientsError } = await supabase
    .from("clients")
    .select("*");
    
  if (clientsError) {
    console.error("Error fetching clients:", clientsError);
    throw new Error(`Failed to fetch clients: ${clientsError.message}`);
  }
  
  return clientsData;
};

// Fetch prestations for a specific facture
const getPrestationsForFacture = async (factureId: string) => {
  const { data: prestationsData, error: prestationsError } = await supabase
    .from("prestations")
    .select("*")
    .eq("facture_id", factureId);
    
  if (prestationsError) {
    console.error(`Error fetching prestations for facture ${factureId}:`, prestationsError);
    throw new Error(`Failed to fetch services for invoice ${factureId}: ${prestationsError.message}`);
  }
  
  return prestationsData || [];
};

// Fetch paiements for a specific facture
const getPaiementsForFacture = async (factureId: string) => {
  const { data: paiementsData, error: paiementsError } = await supabase
    .from("paiements")
    .select("*")
    .eq("facture_id", factureId);
    
  if (paiementsError) {
    console.error(`Error fetching paiements for facture ${factureId}:`, paiementsError);
    throw new Error(`Failed to fetch payments for invoice ${factureId}: ${paiementsError.message}`);
  }
  
  return paiementsData || [];
};

// Map the database client to facture client format
const mapClientToFactureClient = (client: any) => {
  // Safely extract address and contact information with proper type checking
  const adresse = typeof client.adresse === 'object' && client.adresse 
    ? client.adresse 
    : { ville: '', quartier: '', lieuDit: '' };

  const contact = typeof client.contact === 'object' && client.contact 
    ? client.contact 
    : { telephone: '', email: '' };
  
  return {
    id: client.id,
    nom: client.type === "physique" ? client.nom || "" : client.raisonsociale || "",
    adresse: typeof adresse === 'object' && 'ville' in adresse ? adresse.ville as string : "",
    telephone: typeof contact === 'object' && 'telephone' in contact ? contact.telephone as string : "",
    email: typeof contact === 'object' && 'email' in contact ? contact.email as string : ""
  };
};

// Build a complete facture object with all related data
const buildCompleteFacture = (facture: any, client: any, prestationsData: any[], paiementsData: any[]): Facture => {
  return {
    id: facture.id,
    client_id: facture.client_id,
    client: mapClientToFactureClient(client),
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
};

// Fetch all factures with related data
export const getFacturesData = async () => {
  try {
    console.log("Fetching factures data...");
    // Fetch factures data
    const { data: facturesData, error: facturesError } = await supabase
      .from("factures")
      .select("*");
      
    if (facturesError) {
      console.error("Error fetching factures:", facturesError);
      throw new Error(`Failed to fetch invoices: ${facturesError.message}`);
    }
    
    console.log("Factures fetched:", facturesData?.length || 0);
    
    // Fetch clients data once for all factures
    const clientsData = await getClientsData();
    
    // Process each facture with its related data
    const facturesWithDetails = await Promise.all(
      facturesData.map(async (facture) => {
        // Find the client for this facture
        const client = clientsData.find((c) => c.id === facture.client_id);
        
        if (!client) {
          console.error(`Client not found for facture: ${facture.id}`);
          return null;
        }
        
        // Fetch related data for this facture
        const prestationsData = await getPrestationsForFacture(facture.id);
        const paiementsData = await getPaiementsForFacture(facture.id);
        
        // Build and return the complete facture object
        return buildCompleteFacture(facture, client, prestationsData, paiementsData);
      })
    );
    
    // Filter out any null values (factures that failed to load properly)
    const validFactures = facturesWithDetails.filter(f => f !== null) as Facture[];
    console.log("Valid factures processed:", validFactures.length);
    
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
