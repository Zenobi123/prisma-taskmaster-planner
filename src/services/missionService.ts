
import { supabase } from "@/integrations/supabase/client";
import { Mission, MissionType, MissionStatus } from "@/types/mission";

export const getMissions = async () => {
  try {
    const { data, error } = await supabase
      .from("missions")
      .select(`
        *,
        clients (
          id,
          nom,
          raisonsociale,
          type
        ),
        collaborateurs (
          id,
          nom,
          prenom
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des missions:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des missions:", error);
    throw error;
  }
};

export const createMission = async (mission: Omit<Mission, "id" | "created_at" | "updated_at">) => {
  try {
    const { data, error } = await supabase
      .from("missions")
      .insert([mission])
      .select(`
        *,
        clients (
          id,
          nom,
          raisonsociale,
          type
        ),
        collaborateurs (
          id,
          nom,
          prenom
        )
      `)
      .single();

    if (error) {
      console.error("Erreur lors de la création de la mission:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la création de la mission:", error);
    throw error;
  }
};

export const updateMissionStatus = async (missionId: string, status: MissionStatus) => {
  try {
    const { data, error } = await supabase
      .from("missions")
      .update({ status })
      .eq("id", missionId)
      .select(`
        *,
        clients (
          id,
          nom,
          raisonsociale,
          type
        ),
        collaborateurs (
          id,
          nom,
          prenom
        )
      `)
      .single();

    if (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    throw error;
  }
};
