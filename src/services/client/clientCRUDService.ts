
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { toast } from "sonner";
import { validateRegimeFiscal, cleanClientUpdateData, VALID_REGIME_FISCAL } from "./clientValidationService";
import { invalidateClientsCache } from "./clientCacheService";

export const addClient = async (client: Omit<Client, "id" | "interactions" | "created_at">) => {
  
  // Ensure regimefiscal has a valid value - database constraint will enforce this
  const regimefiscal = (VALID_REGIME_FISCAL as readonly string[]).includes(client.regimefiscal) ? client.regimefiscal : "reel";
  
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
    gestionexternalisee: client.gestionexternalisee || false
  };

  const { data, error } = await supabase
    .from("clients")
    .insert([clientData])
    .select()
    .single();

  if (error) {
    throw error;
  }

  
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
    throw error;
  }

  
  // Invalidate cache after successful archive
  invalidateClientsCache();
  
  return data;
};

export const deleteClient = async (id: string) => {
  // First, check if there are any tasks associated with this client
  const { data: clientTasks, error: taskCheckError } = await supabase
    .from("tasks")
    .select("id, status")
    .eq("client_id", id);

  if (taskCheckError) {
    throw taskCheckError;
  }

  // If there are associated tasks, check if all are completed
  if (clientTasks && clientTasks.length > 0) {
    const incompleteTasks = clientTasks.filter(task => task.status !== "termine");
    
    if (incompleteTasks.length > 0) {
      toast.error("Impossible de supprimer ce client car il a des tâches non terminées");
      throw new Error("Le client a des tâches non terminées et ne peut pas être supprimé");
    }
  }

  // Perform soft delete
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
    throw error;
  }

  
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
    throw error;
  }

  
  // Invalidate cache after successful restoration
  invalidateClientsCache();
  
  return data;
};

export const permanentDeleteClient = async (id: string) => {
  // First, check if there are any tasks associated with this client
  const { data: clientTasks, error: taskCheckError } = await supabase
    .from("tasks")
    .select("id, status")
    .eq("client_id", id);

  if (taskCheckError) {
    throw taskCheckError;
  }

  // If there are associated tasks, check if all are completed
  if (clientTasks && clientTasks.length > 0) {
    const incompleteTasks = clientTasks.filter(task => task.status !== "termine");
    
    if (incompleteTasks.length > 0) {
      toast.error("Impossible de supprimer définitivement ce client car il a des tâches non terminées");
      throw new Error("Le client a des tâches non terminées et ne peut pas être supprimé définitivement");
    }
  }

  // Permanent deletion
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  
  // Invalidate cache after successful permanent deletion
  invalidateClientsCache();
};

export const updateClient = async (id: string, updates: Partial<Omit<Client, "id" | "interactions" | "created_at">>) => {
  
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


  const { data, error } = await supabase
    .from("clients")
    .update(cleanedUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    throw error;
  }

  
  // Invalidate cache after successful update
  invalidateClientsCache();
  
  return data;
};
