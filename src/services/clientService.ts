
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

    return data.map(client => ({
      ...client,
      interactions: client.interactions || [],
      adresse: client.adresse || { ville: "", quartier: "", lieuDit: "" },
      contact: client.contact || { telephone: "", email: "" }
    })) as Client[];
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }
};

export const addClient = async (client: Omit<Client, "id" | "interactions" | "created_at">) => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .insert([{ ...client, interactions: [] }])
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
