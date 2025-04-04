
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientType, FormeJuridique, Interaction } from "@/types/client";
import { UnpaidPatenteClient } from "@/types/fiscal";
import { Json } from "@/types/supabase";

// Cache pour stocker les clients avec patentes impayées
const unpaidPatenteClientCache: {
  clients: UnpaidPatenteClient[];
  timestamp: number;
} = {
  clients: [],
  timestamp: 0,
};

/**
 * Récupère la liste des clients qui n'ont pas payé leur patente
 * @returns Promise<Client[]> - Liste des clients concernés
 */
export const getUnpaidPatenteClients = async (): Promise<Client[]> => {
  const now = Date.now();
  const cacheValidity = 5 * 60 * 1000; // 5 minutes en millisecondes

  // Si le cache est valide, retourner les données en cache
  if (unpaidPatenteClientCache.clients.length > 0 && now - unpaidPatenteClientCache.timestamp < cacheValidity) {
    console.log("Utilisation du cache pour les clients avec patentes impayées");
    return unpaidPatenteClientCache.clients as unknown as Client[];
  }

  try {
    const currentYear = new Date().getFullYear();
    
    // Récupérer les clients qui n'ont pas payé leur patente pour l'année en cours
    const { data: clientsData, error } = await supabase
      .from("clients")
      .select(`
        id, type, nom, raisonsociale, sigle, datecreation, lieucreation,
        nomdirigeant, formejuridique, niu, centrerattachement, registrecommerce,
        adresse, contact, fiscal_data, interactions, status, created_at
      `)
      .eq("status", "actif");

    if (error) {
      throw new Error(`Erreur lors de la récupération des clients: ${error.message}`);
    }

    // Filtrer les clients sans patente payée pour l'année en cours
    const clientsWithUnpaidPatente = clientsData.filter((client) => {
      if (!client.fiscal_data) return true;
      
      const fiscalData = client.fiscal_data as Record<string, any>;
      return !fiscalData.patente || !fiscalData.patente[currentYear] || !fiscalData.patente[currentYear].paid;
    });

    // Formatter les données client pour l'affichage
    const formattedClients = clientsWithUnpaidPatente.map((client) => {
      // Cast des propriétés pour correspondre aux types attendus
      const clientWithCorrectTypes = {
        ...client,
        formejuridique: client.formejuridique as FormeJuridique,
        interactions: client.interactions ? client.interactions as unknown as Interaction[] : [],
        fiscal_data: client.fiscal_data as Record<string, any>,
      };

      // Normaliser l'adresse et le contact qui peuvent être null ou de formats différents
      let adresseObj = { ville: "", quartier: "", lieuDit: "" };
      if (client.adresse && typeof client.adresse === 'object') {
        const adresseTemp = client.adresse as Record<string, any>;
        adresseObj = {
          ville: adresseTemp.ville || "",
          quartier: adresseTemp.quartier || "",
          lieuDit: adresseTemp.lieuDit || ""
        };
      }

      let contactObj = { telephone: "", email: "" };
      if (client.contact && typeof client.contact === 'object') {
        const contactTemp = client.contact as Record<string, any>;
        contactObj = {
          telephone: contactTemp.telephone || "",
          email: contactTemp.email || ""
        };
      }

      // Retourner le client formaté avec les bonnes structures
      return {
        ...clientWithCorrectTypes,
        adresse: adresseObj,
        contact: contactObj
      } as unknown as Client;
    });

    // Mettre à jour le cache
    unpaidPatenteClientCache.clients = formattedClients as unknown as UnpaidPatenteClient[];
    unpaidPatenteClientCache.timestamp = now;

    return formattedClients;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients avec patentes impayées:", error);
    throw error;
  }
};

// Fonction pour obtenir le nombre de clients avec patentes impayées
export const getUnpaidPatenteClientsCount = async (): Promise<number> => {
  try {
    const clients = await getUnpaidPatenteClients();
    return clients.length;
  } catch (error) {
    console.error("Erreur lors du comptage des clients avec patentes impayées:", error);
    return 0;
  }
};
