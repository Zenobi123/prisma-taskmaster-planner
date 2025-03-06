
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type ClientRow = Database['public']['Tables']['clients']['Row'];

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
    return clients.map((client: ClientRow) => ({
      id: client.id,
      type: client.type as "physique" | "morale",
      nom: client.nom || null,
      raisonsociale: client.raisonsociale || null,
      sigle: client.sigle || null,
      datecreation: client.datecreation || null,
      lieucreation: client.lieucreation || null,
      nomdirigeant: client.nomdirigeant || null,
      formejuridique: client.formejuridique || null,
      niu: client.niu,
      centrerattachement: client.centrerattachement,
      sexe: client.sexe || undefined,
      etatcivil: client.etatcivil || undefined,
      regimefiscal: client.regimefiscal || undefined,
      situationimmobiliere: client.situationimmobiliere || { type: "locataire" },
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
      interactions: (Array.isArray(client.interactions) ? client.interactions : []).map((interaction: any) => ({
        id: interaction.id || crypto.randomUUID(),
        date: interaction.date || new Date().toISOString(),
        description: interaction.description || ""
      })),
      statut: client.statut as "actif" | "inactif",
      gestionexternalisee: client.gestionexternalisee || false,
      created_at: client.created_at
    })) as Client[];
  }

  return [];
};

export const addClient = async (client: Omit<Client, "id" | "interactions" | "created_at">) => {
  console.log("Données du client à ajouter:", client);
  const { data, error } = await supabase
    .from("clients")
    .insert([{
      type: client.type,
      nom: client.nom,
      raisonsociale: client.raisonsociale,
      sigle: client.sigle,
      datecreation: client.datecreation,
      lieucreation: client.lieucreation,
      nomdirigeant: client.nomdirigeant,
      formejuridique: client.formejuridique,
      niu: client.niu,
      centrerattachement: client.centrerattachement,
      adresse: client.adresse,
      contact: client.contact,
      secteuractivite: client.secteuractivite,
      numerocnps: client.numerocnps,
      sexe: client.sexe,
      etatcivil: client.etatcivil,
      regimefiscal: client.regimefiscal,
      situationimmobiliere: client.situationimmobiliere,
      interactions: [],
      statut: "actif",
      gestionexternalisee: client.gestionexternalisee || false
    }])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout du client:", error);
    throw error;
  }

  console.log("Client ajouté avec succès:", data);
  return data;
};

export const deleteClient = async (id: string) => {
  // First, check if there are any tasks associated with this client
  const { data: clientTasks, error: taskCheckError } = await supabase
    .from("tasks")
    .select("id")
    .eq("client_id", id);

  if (taskCheckError) {
    console.error("Erreur lors de la vérification des tâches associées:", taskCheckError);
    throw taskCheckError;
  }

  // If there are associated tasks, we cannot delete the client directly
  if (clientTasks && clientTasks.length > 0) {
    console.error("Impossible de supprimer le client car il a des tâches associées");
    toast.error("Impossible de supprimer ce client car il a des tâches associées");
    throw new Error("Le client a des tâches associées et ne peut pas être supprimé");
  }

  // If no tasks are associated, proceed with deletion
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la suppression du client:", error);
    throw error;
  }

  console.log("Client supprimé avec succès");
};

export const updateClient = async (id: string, updates: Partial<Omit<Client, "id" | "interactions" | "created_at">>) => {
  console.log("Mise à jour du client:", { id, updates });
  
  const updateData = {
    ...updates,
    // Assurez-vous que les champs sont correctement formatés pour la base de données
    situationimmobiliere: updates.situationimmobiliere || undefined,
    adresse: updates.adresse || undefined,
    contact: updates.contact || undefined,
    // Retirez les champs qui ne doivent pas être mis à jour
    id: undefined,
    created_at: undefined,
    interactions: undefined
  };

  console.log("Données formatées pour la mise à jour:", updateData);

  const { data, error } = await supabase
    .from("clients")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    throw error;
  }

  console.log("Client mis à jour avec succès:", data);
  return data;
};
