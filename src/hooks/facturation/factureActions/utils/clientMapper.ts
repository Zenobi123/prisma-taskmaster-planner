
import { Client } from "@/types/client";

export const mapClientToPdfClient = (clientData: any): Client => {
  console.log("Mapping client data:", clientData);
  
  if (
    clientData && 
    typeof clientData === 'object' && 
    'type' in clientData &&
    'niu' in clientData &&
    'adresse' in clientData &&
    typeof clientData.adresse === 'object' &&
    'contact' in clientData &&
    typeof clientData.contact === 'object'
  ) {
    return clientData as Client;
  }
  
  return {
    id: clientData.id || '',
    type: clientData.type || 'physique',
    nom: clientData.nom || '',
    raisonsociale: clientData.raisonsociale || '',
    niu: clientData.niu || '',
    adresse: typeof clientData.adresse === 'object' 
      ? clientData.adresse 
      : { 
          ville: typeof clientData.adresse === 'string' ? clientData.adresse : '', 
          quartier: '', 
          lieuDit: '' 
        },
    contact: typeof clientData.contact === 'object'
      ? clientData.contact
      : {
          telephone: clientData.telephone || '',
          email: clientData.email || ''
        },
    centrerattachement: clientData.centrerattachement || '',
    secteuractivite: clientData.secteuractivite || '',
    statut: clientData.statut || 'actif',
    interactions: clientData.interactions || [],
    gestionexternalisee: clientData.gestionexternalisee || false
  };
};
