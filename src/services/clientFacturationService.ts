
import { supabase } from "@/integrations/supabase/client";

// Type pour les clients formatés pour la facturation
export interface ClientFacturation {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}

export const getClientsFacturation = async (): Promise<ClientFacturation[]> => {
  const { data, error } = await supabase
    .from("clients")
    .select("id, nom, raisonsociale, type, adresse, contact")
    .eq("statut", "actif");

  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  // Formater les clients pour l'affichage dans la facturation
  return data.map(client => {
    // Traiter l'adresse et le contact de manière sécurisée
    const adresse = client.adresse as Record<string, string>;
    const contact = client.contact as Record<string, string>;
    
    return {
      id: client.id,
      nom: client.type === "physique" ? client.nom : client.raisonsociale,
      adresse: `${adresse.quartier}, ${adresse.ville}`,
      telephone: contact.telephone,
      email: contact.email
    };
  });
};

export const getClientFacturationById = async (id: string): Promise<ClientFacturation> => {
  const { data, error } = await supabase
    .from("clients")
    .select("id, nom, raisonsociale, type, adresse, contact")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération du client:", error);
    throw error;
  }

  // Traiter l'adresse et le contact de manière sécurisée
  const adresse = data.adresse as Record<string, string>;
  const contact = data.contact as Record<string, string>;

  return {
    id: data.id,
    nom: data.type === "physique" ? data.nom : data.raisonsociale,
    adresse: `${adresse.quartier}, ${adresse.ville}`,
    telephone: contact.telephone,
    email: contact.email
  };
};
