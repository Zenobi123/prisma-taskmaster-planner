
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { toast } from "sonner";
import { validateRegimeFiscal, cleanClientUpdateData, VALID_REGIME_FISCAL } from "./clientValidationService";
import { invalidateClientsCache } from "./clientCacheService";

export const addClient = async (client: Omit<Client, "id" | "interactions" | "created_at">) => {
  console.log("Données du client à ajouter:", client);
  
  // Ensure regimefiscal has a valid value - database constraint will enforce this
  const regimefiscal = VALID_REGIME_FISCAL.includes(client.regimefiscal as any) ? client.regimefiscal : "reel";
  
  const clientData = {
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
    regimefiscal: regimefiscal,
    sexe: client.sexe,
    etatcivil: client.etatcivil,
    situationimmobiliere: client.situationimmobiliere,
    interactions: [],
    statut: "actif",
    gestionexternalisee: client.gestionexternalisee || false,
    inscriptionfanrharmony2: client.inscriptionfanrharmony2 || false
  };

  const { data, error } = await supabase
    .from("clients")
    .insert([clientData])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout du client:", error);
    throw error;
  }

  console.log("Client ajouté avec succès:", data);
  
  // Invalidate cache after successful addition
  invalidateClientsCache();
  
  return data;
};

export const archiveClient = async (id: string) => {
  // First, check if there are any tasks associated with this client
  const { data: clientTasks, error: taskCheckError } = await supabase
    .from("tasks")
    .select("id")
    .eq("client_id", id);

  if (taskCheckError) {
    console.error("Erreur lors de la vérification des tâches associées:", taskCheckError);
    throw taskCheckError;
  }

  // We can archive the client even if it has tasks
  const { data, error } = await supabase
    .from("clients")
    .update({ statut: "archive" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'archivage du client:", error);
    throw error;
  }

  console.log("Client archivé avec succès:", data);
  
  // Invalidate cache after successful archive
  invalidateClientsCache();
  
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

  // Perform soft delete instead of hard delete
  const { data, error } = await supabase
    .from("clients")
    .update({ 
      statut: "supprime",
      deleted_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la suppression du client:", error);
    throw error;
  }

  console.log("Client supprimé avec succès (soft delete):", data);
  
  // Invalidate cache after successful deletion
  invalidateClientsCache();
  
  return data;
};

export const restoreClient = async (id: string) => {
  const { data, error } = await supabase
    .from("clients")
    .update({ 
      statut: "actif",
      deleted_at: null
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la restauration du client:", error);
    throw error;
  }

  console.log("Client restauré avec succès:", data);
  
  // Invalidate cache after successful restoration
  invalidateClientsCache();
  
  return data;
};

export const permanentDeleteClient = async (id: string) => {
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
    console.error("Impossible de supprimer définitivement le client car il a des tâches associées");
    toast.error("Impossible de supprimer définitivement ce client car il a des tâches associées");
    throw new Error("Le client a des tâches associées et ne peut pas être supprimé définitivement");
  }

  // Permanent deletion
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la suppression définitive du client:", error);
    throw error;
  }

  console.log("Client supprimé définitivement avec succès");
  
  // Invalidate cache after successful permanent deletion
  invalidateClientsCache();
};

export const updateClient = async (id: string, updates: Partial<Omit<Client, "id" | "interactions" | "created_at">>) => {
  console.log("Mise à jour du client:", { id, updates });
  
  // Validation for regimefiscal - database constraint will enforce this
  let regimefiscal = updates.regimefiscal;
  if (regimefiscal !== undefined) {
    regimefiscal = validateRegimeFiscal(regimefiscal);
  }
  
  // Clean up the data before sending to Supabase
  const cleanedUpdates = cleanClientUpdateData(updates);
  
  if (regimefiscal !== undefined) {
    cleanedUpdates.regimefiscal = regimefiscal;
  }

  console.log("Données nettoyées pour la mise à jour:", cleanedUpdates);

  const { data, error } = await supabase
    .from("clients")
    .update(cleanedUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    throw error;
  }

  console.log("Client mis à jour avec succès:", data);
  
  // Invalidate cache after successful update
  invalidateClientsCache();
  
  return data;
};
