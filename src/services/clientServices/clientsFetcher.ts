
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { Database } from "@/integrations/supabase/types";
import { formatClientFromDatabase } from "./clientFormatter";

type ClientRow = Database['public']['Tables']['clients']['Row'];

/**
 * Fetches all clients from the database
 */
export const getClients = async () => {
  console.log("Récupération des clients...");
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  console.log("Clients récupérés:", clients);

  if (clients) {
    return clients.map((client: ClientRow) => formatClientFromDatabase(client)) as Client[];
  }

  return [];
};
