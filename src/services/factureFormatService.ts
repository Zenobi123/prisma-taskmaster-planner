
import { Client } from "@/types/client";

// Format clients for client selector
export const formatClientsForSelector = (clientsData: any[]): Client[] => {
  if (!clientsData || !Array.isArray(clientsData)) {
    console.warn("formatClientsForSelector: clientsData is not an array", clientsData);
    return [];
  }
  
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
      type: client.type || "physique",
      raisonsociale: client.raisonsociale || "",
      niu: client.niu || "",
      centrerattachement: client.centrerattachement || "",
      secteuractivite: client.secteuractivite || "",
      statut: client.statut || "actif",
      interactions: client.interactions || [],
      adresse: adresse,
      contact: contact,
      gestionexternalisee: client.gestionexternalisee || false,
    } as Client;
  });
};
