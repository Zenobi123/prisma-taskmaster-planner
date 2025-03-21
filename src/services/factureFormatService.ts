
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
      adresse: typeof adresse === 'object' && 'ville' in adresse ? adresse.ville as string : "",
      telephone: typeof contact === 'object' && 'telephone' in contact ? contact.telephone as string : "",
      email: typeof contact === 'object' && 'email' in contact ? contact.email as string : "",
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
