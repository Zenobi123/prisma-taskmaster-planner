
import { exportToPdf } from "@/utils/exports";
import { supabase } from "@/integrations/supabase/client";

export const generateObligationsFiscalesReport = async () => {
  try {
    const { data: obligations, error } = await supabase
      .from('fiscal_obligations')
      .select(`
        *,
        clients(nom, raisonsociale, niu)
      `);

    if (error) throw error;

    const reportData = obligations?.map(o => ({
      client: o.clients?.nom || o.clients?.raisonsociale || 'N/A',
      niu: o.clients?.niu || 'N/A',
      type_obligation: o.type_obligation.toUpperCase(),
      periode: o.periode,
      echeance: o.date_echeance || 'N/A',
      depose: o.depose ? 'Oui' : 'Non',
      paye: o.paye ? 'Oui' : 'Non',
      montant: o.montant || 0,
      observations: o.observations || ''
    })) || [];

    exportToPdf(
      "Rapport Obligations Fiscales",
      reportData,
      `obligations-fiscales-${new Date().toISOString().slice(0, 10)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport obligations:", error);
  }
};

export const generateRetardsFiscauxReport = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: obligations, error } = await supabase
      .from('fiscal_obligations')
      .select(`
        *,
        clients(nom, raisonsociale, niu, contact)
      `)
      .or('depose.eq.false,paye.eq.false')
      .lt('date_echeance', today);

    if (error) throw error;

    const reportData = obligations?.map(o => {
      const echeance = new Date(o.date_echeance || '');
      const joursRetard = Math.floor((new Date().getTime() - echeance.getTime()) / (1000 * 60 * 60 * 24));
      const contact = o.clients?.contact as any;
      
      return {
        client: o.clients?.nom || o.clients?.raisonsociale || 'N/A',
        niu: o.clients?.niu || 'N/A',
        type_obligation: o.type_obligation.toUpperCase(),
        periode: o.periode,
        echeance: o.date_echeance || 'N/A',
        jours_retard: joursRetard,
        non_depose: !o.depose ? 'Oui' : 'Non',
        non_paye: !o.paye ? 'Oui' : 'Non',
        telephone: contact?.telephone || 'N/A'
      };
    }) || [];

    exportToPdf(
      "Rapport Retards Fiscaux",
      reportData,
      `retards-fiscaux-${new Date().toISOString().slice(0, 10)}`
    );
  } catch (error) {
    console.error("Erreur génération rapport retards:", error);
  }
};
