
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CapitalSocial, Actionnaire } from "@/types/capitalSocial";
import { toast } from "sonner";

export const useCapitalSocial = (clientId: string | undefined) => {
  const [capitalSocial, setCapitalSocial] = useState<CapitalSocial | null>(null);
  const [actionnaires, setActionnaires] = useState<Actionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Charger les données du capital social
  const fetchCapitalSocial = async () => {
    if (!clientId) return;

    setIsLoading(true);
    try {
      const { data: capitalData, error: capitalError } = await supabase
        .from('capital_social')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      if (capitalError) throw capitalError;

      const { data: actionnaireData, error: actionnaireError } = await supabase
        .from('actionnaires')
        .select('*')
        .eq('client_id', clientId);

      if (actionnaireError) throw actionnaireError;

      // Convertir et valider les données du capital social
      const formattedCapitalData = capitalData ? {
        ...capitalData,
        type_capital: (capitalData.type_capital === 'parts' ? 'parts' : 'actions') as 'actions' | 'parts'
      } : null;

      setCapitalSocial(formattedCapitalData);
      setActionnaires(actionnaireData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données du capital');
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder le capital social
  const saveCapitalSocial = async (data: Partial<CapitalSocial>) => {
    if (!clientId) return false;

    try {
      const capitalData = { ...data, client_id: clientId };

      if (capitalSocial?.id) {
        const { error } = await supabase
          .from('capital_social')
          .update(capitalData)
          .eq('id', capitalSocial.id);

        if (error) throw error;
      } else {
        const { data: newCapital, error } = await supabase
          .from('capital_social')
          .insert(capitalData)
          .select()
          .single();

        if (error) throw error;
        
        // Formater les données avant de les stocker
        const formattedNewCapital = {
          ...newCapital,
          type_capital: (newCapital.type_capital === 'parts' ? 'parts' : 'actions') as 'actions' | 'parts'
        };
        setCapitalSocial(formattedNewCapital);
      }

      setHasUnsavedChanges(false);
      toast.success('Capital social sauvegardé avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde du capital social');
      return false;
    }
  };

  // Ajouter un actionnaire
  const addActionnaire = async (data: Omit<Actionnaire, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => {
    if (!clientId) return false;

    try {
      const { data: newActionnaire, error } = await supabase
        .from('actionnaires')
        .insert({ ...data, client_id: clientId })
        .select()
        .single();

      if (error) throw error;

      setActionnaires(prev => [...prev, newActionnaire]);
      toast.success('Actionnaire ajouté avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout de l\'actionnaire');
      return false;
    }
  };

  // Mettre à jour un actionnaire
  const updateActionnaire = async (id: string, data: Partial<Actionnaire>) => {
    try {
      const { error } = await supabase
        .from('actionnaires')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      setActionnaires(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
      toast.success('Actionnaire mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de l\'actionnaire');
      return false;
    }
  };

  // Supprimer un actionnaire
  const deleteActionnaire = async (id: string) => {
    try {
      const { error } = await supabase
        .from('actionnaires')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setActionnaires(prev => prev.filter(a => a.id !== id));
      toast.success('Actionnaire supprimé avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de l\'actionnaire');
      return false;
    }
  };

  useEffect(() => {
    fetchCapitalSocial();
  }, [clientId]);

  return {
    capitalSocial,
    actionnaires,
    isLoading,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    saveCapitalSocial,
    addActionnaire,
    updateActionnaire,
    deleteActionnaire,
    refetch: fetchCapitalSocial
  };
};
