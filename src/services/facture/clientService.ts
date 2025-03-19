
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/facture";

export const fetchClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from("clients")
    .select("id, nom, raisonsociale, contact, adresse")
    .order("nom", { ascending: true });

  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw new Error(error.message);
  }

  return data.map(client => ({
    id: client.id,
    nom: client.raisonsociale || client.nom || "Client sans nom",
    email: client.contact && typeof client.contact === 'object' 
      ? typeof client.contact.email === 'string' ? client.contact.email : "" 
      : "",
    telephone: client.contact && typeof client.contact === 'object'
      ? typeof client.contact.telephone === 'string' ? client.contact.telephone : ""
      : "",
    adresse: formatAdresse(client.adresse)
  }));
};

export const fetchClientById = async (id: string): Promise<Client> => {
  const { data, error } = await supabase
    .from("clients")
    .select("id, nom, raisonsociale, contact, adresse")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération du client:", error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    nom: data.raisonsociale || data.nom || "Client sans nom",
    email: data.contact && typeof data.contact === 'object'
      ? typeof data.contact.email === 'string' ? data.contact.email : ""
      : "",
    telephone: data.contact && typeof data.contact === 'object'
      ? typeof data.contact.telephone === 'string' ? data.contact.telephone : ""
      : "",
    adresse: formatAdresse(data.adresse)
  };
};

const formatAdresse = (adresse: any): string => {
  if (!adresse) return "";
  
  if (typeof adresse === 'string') {
    return adresse;
  }
  
  const parts = [
    adresse.rue,
    adresse.quartier,
    adresse.ville,
    adresse.pays
  ].filter(Boolean);
  
  return parts.join(", ");
};
