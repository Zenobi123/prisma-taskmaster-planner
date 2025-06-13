
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { mapClientRowToClient } from "@/services/client/clientDataMapper";
import { shouldClientBeSubjectToObligation } from "@/services/fiscal/defaultObligationRules";

export interface SubjectClientsCount {
  igs: number;
  patente: number;
  dsf: number;
  darp: number;
}

export const getClientsSubjectToObligation = async (): Promise<SubjectClientsCount> => {
  try {
    console.log("Fetching all active clients to count subject clients...");
    
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .eq('statut', 'actif');

    if (error) {
      console.error('Error fetching clients:', error);
      return { igs: 0, patente: 0, dsf: 0, darp: 0 };
    }

    if (!clientsData) return { igs: 0, patente: 0, dsf: 0, darp: 0 };

    // Map raw client data to Client type
    const clients = clientsData.map(mapClientRowToClient);

    const counts = {
      igs: 0,
      patente: 0,
      dsf: 0,
      darp: 0
    };

    clients.forEach(client => {
      try {
        if (shouldClientBeSubjectToObligation(client, "igs")) {
          counts.igs++;
        }
        if (shouldClientBeSubjectToObligation(client, "patente")) {
          counts.patente++;
        }
        if (shouldClientBeSubjectToObligation(client, "dsf")) {
          counts.dsf++;
        }
        if (shouldClientBeSubjectToObligation(client, "darp")) {
          counts.darp++;
        }
      } catch (error) {
        console.error(`Error processing client ${client.id} for subject obligations:`, error);
      }
    });

    console.log(`Subject clients count:`, counts);
    return counts;
    
  } catch (error) {
    console.error('Error in getClientsSubjectToObligation:', error);
    return { igs: 0, patente: 0, dsf: 0, darp: 0 };
  }
};
