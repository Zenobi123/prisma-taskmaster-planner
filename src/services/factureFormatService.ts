
import { Client } from "@/types/client";

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
      type: client.type,
      niu: client.niu,
      centrerattachement: client.centrerattachement,
      secteuractivite: client.secteuractivite,
      statut: client.statut,
      interactions: client.interactions || [],
      adresse: adresse,
      contact: contact,
      gestionexternalisee: client.gestionexternalisee || false,
    } as Client;
  });
};
