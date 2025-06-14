
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { generateCourrierContent, Template } from "@/utils/courrierTemplates";
import { exportToPdf } from "@/utils/exports/pdfExporter";

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

    // Transform the data to match Client type
    const transformedData = data?.map(client => ({
      ...client,
      type: client.type as 'physique' | 'morale',
      contact: typeof client.contact === 'object' ? client.contact : {},
      adresse: typeof client.adresse === 'object' ? client.adresse : {},
      fiscal_data: typeof client.fiscal_data === 'object' ? client.fiscal_data : {}
    })) || [];

    return transformedData as Client[];
  } catch (error) {
    console.error('Erreur dans getClientsForCourrier:', error);
    throw error;
  }
};

export const sendCourrier = async (clientIds: string[], templateId: string, customMessage: string): Promise<void> => {
  try {
    console.log('Génération du courrier PDF pour:', { clientIds, templateId, customMessage });
    
    // Récupérer les clients sélectionnés
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .in('id', clientIds);

    if (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }

    if (!clients || clients.length === 0) {
      throw new Error('Aucun client trouvé');
    }

    // Récupérer le template
    const { courrierTemplates } = await import('@/utils/courrierTemplates');
    const template = courrierTemplates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error('Template non trouvé');
    }

    // Générer le PDF pour chaque client
    for (const client of clients) {
      const clientName = client.type === 'morale' ? client.raisonsociale : client.nom;
      const courrierContent = generateCourrierContent(client, template, customMessage);
      
      // Préparer les données pour le PDF
      const pdfData = [
        {
          destinataire: clientName,
          niu: client.niu || 'N/A',
          centre: client.centrerattachement || 'N/A',
          template: template.title,
          contenu: courrierContent
        }
      ];

      // Générer le PDF
      const filename = `courrier-${clientName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
      exportToPdf(`Courrier - ${template.title}`, pdfData, filename);
    }

    console.log('Courriers PDF générés avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du courrier:', error);
    throw error;
  }
};
