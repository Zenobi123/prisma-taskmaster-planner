
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";

export const getClientsForCourrier = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif')
      .order('nom', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur dans getClientsForCourrier:', error);
    throw error;
  }
};

export const sendCourrier = async (clientIds: string[], templateId: string, customMessage: string): Promise<void> => {
  try {
    // Simulation de l'envoi de courrier
    console.log('Envoi du courrier:', { clientIds, templateId, customMessage });
    
    // Ici, on pourrait intégrer avec un service d'envoi d'emails ou de courrier
    // Pour l'instant, on simule juste l'envoi
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Courrier envoyé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi du courrier:', error);
    throw error;
  }
};
