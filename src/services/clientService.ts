
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

export const getClients = async () => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*");

    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      throw error;
    }

    if (!data) return [];

    // Ensure the data matches the Client type by explicitly mapping the fields
    return data.map(client => ({
      id: client.id,
      type: client.type as "physique" | "morale",
      nom: client.nom || null,
      raisonsociale: client.raisonsociale || null,
      niu: client.niu,
      centrerattachement: client.centrerattachement,
      adresse: {
        ville: (client.adresse as any)?.ville || "",
        quartier: (client.adresse as any)?.quartier || "",
        lieuDit: (client.adresse as any)?.lieuDit || ""
      },
      contact: {
        telephone: (client.contact as any)?.telephone || "",
        email: (client.contact as any)?.email || ""
      },
      secteuractivite: client.secteuractivite,
      numerocnps: client.numerocnps || null,
      interactions: Array.isArray(client.interactions) ? client.interactions : [],
      statut: client.statut as "actif" | "inactif",
      created_at: client.created_at
    })) as Client[];
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }
};

export const addClient = async (client: Omit<Client, "id" | "interactions" | "created_at">) => {
  console.log("Données du client à ajouter:", client);
  try {
    const { data, error } = await supabase
      .from("clients")
      .insert([{ 
        ...client,
        interactions: [],
        statut: "actif"
      }])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'ajout du client:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du client:", error);
    throw error;
  }
};

export const deleteClient = async (id: string) => {
  try {
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur lors de la suppression du client:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du client:", error);
    throw error;
  }
};

export const updateClient = async (id: string, updates: Partial<Omit<Client, "id" | "interactions" | "created_at">>) => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    throw error;
  }
};
