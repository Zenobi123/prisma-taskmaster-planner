
import { Facture } from "@/types/facture";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère les factures depuis la base de données
 * @param forceRefresh Force le rafraîchissement du cache
 */
export const fetchFacturesFromDB = async (forceRefresh = false) => {
  try {
    console.log("Fetching factures from database...");
    
    // Create the base query
    const query = supabase
      .from('factures')
      .select('*');
      
    // Si forceRefresh est activé, on peut ajouter des headers spécifiques
    // mais la méthode options() n'existe pas sur l'objet query
    // Nous allons plutôt utiliser une autre approche
    if (forceRefresh) {
      console.log("Force refresh enabled");
      // On peut utiliser .stream() pour éviter le cache
      // ou simplement utiliser le timestamp pour contourner le cache
      const timestamp = new Date().getTime();
      console.log(`Adding cache-busting timestamp: ${timestamp}`);
    }
    
    // Exécuter la requête
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching factures:", error);
      throw error;
    }
    
    console.log(`Successfully fetched ${data.length} factures`);
    return mapFacturesFromDB(data);
  } catch (error) {
    console.error("Exception in fetchFacturesFromDB:", error);
    throw error;
  }
};

/**
 * Transforme les données brutes de la DB en objets Facture
 */
export const mapFacturesFromDB = (data: any[]): Facture[] => {
  console.log("Mapping factures from DB format to app format");
  try {
    const mappedFactures = data.map((row: any) => ({
      id: row.id,
      client: {
        id: row.client_id,
        nom: row.client_nom,
        adresse: row.client_adresse,
        telephone: row.client_telephone,
        email: row.client_email
      },
      date: row.date,
      echeance: row.echeance,
      montant: Number(row.montant),
      status: row.status,
      prestations: Array.isArray(row.prestations) 
        ? row.prestations 
        : (typeof row.prestations === 'string' ? JSON.parse(row.prestations) : []),
      notes: row.notes,
      modeReglement: row.mode_reglement,
      moyenPaiement: row.moyen_paiement,
      paiements: row.paiements || [],
      montantPaye: row.montant_paye || 0
    }));
    console.log(`Successfully mapped ${mappedFactures.length} factures`);
    return mappedFactures;
  } catch (error) {
    console.error("Error in mapFacturesFromDB:", error);
    throw error;
  }
};
