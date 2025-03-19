
import { supabase } from "@/integrations/supabase/client";
import { Facture, Prestation, Paiement } from "@/types/facture";

export const getFactures = async (): Promise<Facture[]> => {
  const { data: factures, error } = await supabase
    .from("factures")
    .select(`
      *,
      client:client_id(
        id,
        nom,
        raisonsociale,
        type,
        contact,
        adresse
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des factures:", error);
    throw error;
  }

  // Récupérer les prestations et paiements pour chaque facture
  const facturesCompletes = await Promise.all(
    factures.map(async (facture) => {
      // Récupérer les prestations
      const { data: prestations, error: erreurPrestations } = await supabase
        .from("prestations")
        .select("*")
        .eq("facture_id", facture.id);

      if (erreurPrestations) {
        console.error("Erreur lors de la récupération des prestations:", erreurPrestations);
      }

      // Récupérer les paiements
      const { data: paiements, error: erreurPaiements } = await supabase
        .from("paiements")
        .select("*")
        .eq("facture_id", facture.id);

      if (erreurPaiements) {
        console.error("Erreur lors de la récupération des paiements:", erreurPaiements);
      }

      // Formater les données client avec validation des types
      const adresse = facture.client.adresse as Record<string, string>;
      const contact = facture.client.contact as Record<string, string>;
      
      const client = {
        id: facture.client.id,
        nom: facture.client.type === "physique" ? facture.client.nom : facture.client.raisonsociale,
        adresse: `${adresse.quartier || ''}, ${adresse.ville || ''}`,
        telephone: contact.telephone || '',
        email: contact.email || ''
      };

      // S'assurer que le statut correspond à un type valide
      const status = mapStatusToValidEnum(facture.status);

      return {
        ...facture,
        client,
        status,
        prestations: prestations || [],
        paiements: paiements || []
      } as Facture;
    })
  );

  return facturesCompletes;
};

export const getFactureById = async (id: string): Promise<Facture> => {
  const { data: facture, error } = await supabase
    .from("factures")
    .select(`
      *,
      client:client_id(
        id,
        nom,
        raisonsociale,
        type,
        contact,
        adresse
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de la facture:", error);
    throw error;
  }

  // Récupérer les prestations
  const { data: prestations, error: erreurPrestations } = await supabase
    .from("prestations")
    .select("*")
    .eq("facture_id", facture.id);

  if (erreurPrestations) {
    console.error("Erreur lors de la récupération des prestations:", erreurPrestations);
    throw erreurPrestations;
  }

  // Récupérer les paiements
  const { data: paiements, error: erreurPaiements } = await supabase
    .from("paiements")
    .select("*")
    .eq("facture_id", facture.id);

  if (erreurPaiements) {
    console.error("Erreur lors de la récupération des paiements:", erreurPaiements);
    throw erreurPaiements;
  }

  // Formater les données client avec validation des types
  const adresse = facture.client.adresse as Record<string, string>;
  const contact = facture.client.contact as Record<string, string>;
  
  const client = {
    id: facture.client.id,
    nom: facture.client.type === "physique" ? facture.client.nom : facture.client.raisonsociale,
    adresse: `${adresse.quartier || ''}, ${adresse.ville || ''}`,
    telephone: contact.telephone || '',
    email: contact.email || ''
  };

  // S'assurer que le statut correspond à un type valide
  const status = mapStatusToValidEnum(facture.status);

  return {
    ...facture,
    client,
    status,
    prestations: prestations || [],
    paiements: paiements || []
  } as Facture;
};

// Fonction utilitaire pour assurer que le statut est d'un type valide
function mapStatusToValidEnum(status: string): Facture["status"] {
  switch (status) {
    case "en_attente":
      return "en_attente";
    case "envoyée":
      return "envoyée";
    case "payée":
      return "payée";
    case "partiellement_payée":
      return "partiellement_payée";
    case "annulée":
      return "annulée";
    default:
      return "en_attente"; // Valeur par défaut si le statut est inconnu
  }
}

export const createFacture = async (factureData: Omit<Facture, "id" | "client">): Promise<Facture> => {
  // 1. Créer la facture
  const { data: facture, error } = await supabase
    .from("factures")
    .insert({
      client_id: factureData.client_id,
      date: factureData.date,
      echeance: factureData.echeance,
      montant: factureData.montant,
      status: factureData.status,
      notes: factureData.notes
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création de la facture:", error);
    throw error;
  }

  // 2. Ajouter les prestations
  if (factureData.prestations && factureData.prestations.length > 0) {
    const prestationsData = factureData.prestations.map(prestation => ({
      facture_id: facture.id,
      description: prestation.description,
      quantite: prestation.quantite,
      montant: prestation.montant,
      taux: prestation.taux || 0
    }));

    const { error: prestationsError } = await supabase
      .from("prestations")
      .insert(prestationsData);

    if (prestationsError) {
      console.error("Erreur lors de l'ajout des prestations:", prestationsError);
      throw prestationsError;
    }
  }

  // Récupérer la facture complète
  return getFactureById(facture.id);
};

export const updateFacture = async (id: string, factureData: Partial<Facture>): Promise<Facture> => {
  // 1. Mettre à jour la facture
  const { error } = await supabase
    .from("factures")
    .update({
      client_id: factureData.client_id,
      date: factureData.date,
      echeance: factureData.echeance,
      montant: factureData.montant,
      montant_paye: factureData.montant_paye,
      status: factureData.status,
      notes: factureData.notes
    })
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la mise à jour de la facture:", error);
    throw error;
  }

  // 2. Si des prestations sont fournies, supprimer les anciennes et ajouter les nouvelles
  if (factureData.prestations) {
    // Supprimer les anciennes prestations
    const { error: deleteError } = await supabase
      .from("prestations")
      .delete()
      .eq("facture_id", id);

    if (deleteError) {
      console.error("Erreur lors de la suppression des prestations:", deleteError);
      throw deleteError;
    }

    // Ajouter les nouvelles prestations
    if (factureData.prestations.length > 0) {
      const prestationsData = factureData.prestations.map(prestation => ({
        facture_id: id,
        description: prestation.description,
        quantite: prestation.quantite,
        montant: prestation.montant,
        taux: prestation.taux || 0
      }));

      const { error: prestationsError } = await supabase
        .from("prestations")
        .insert(prestationsData);

      if (prestationsError) {
        console.error("Erreur lors de l'ajout des prestations:", prestationsError);
        throw prestationsError;
      }
    }
  }

  // Récupérer la facture mise à jour
  return getFactureById(id);
};

export const deleteFacture = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("factures")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la suppression de la facture:", error);
    throw error;
  }
};

export const addPaiement = async (paiementData: Omit<Paiement, "id">): Promise<Paiement> => {
  const { data: paiement, error } = await supabase
    .from("paiements")
    .insert({
      facture_id: paiementData.facture_id,
      date: paiementData.date,
      montant: paiementData.montant,
      mode: paiementData.mode,
      notes: paiementData.notes
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout du paiement:", error);
    throw error;
  }

  // Mettre à jour le montant payé et le statut de la facture
  await updateMontantPayeEtStatut(paiementData.facture_id);

  return paiement;
};

export const deletePaiement = async (id: string): Promise<void> => {
  // Récupérer d'abord le paiement pour connaître la facture associée
  const { data: paiement, error: fetchError } = await supabase
    .from("paiements")
    .select("facture_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Erreur lors de la récupération du paiement:", fetchError);
    throw fetchError;
  }

  // Supprimer le paiement
  const { error } = await supabase
    .from("paiements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur lors de la suppression du paiement:", error);
    throw error;
  }

  // Mettre à jour le montant payé et le statut de la facture
  await updateMontantPayeEtStatut(paiement.facture_id);
};

// Fonction utilitaire pour mettre à jour le montant payé et le statut de la facture
async function updateMontantPayeEtStatut(factureId: string): Promise<void> {
  // 1. Récupérer la facture et ses paiements
  const { data: facture, error: factureError } = await supabase
    .from("factures")
    .select("montant")
    .eq("id", factureId)
    .single();

  if (factureError) {
    console.error("Erreur lors de la récupération de la facture:", factureError);
    throw factureError;
  }

  const { data: paiements, error: paiementsError } = await supabase
    .from("paiements")
    .select("montant")
    .eq("facture_id", factureId);

  if (paiementsError) {
    console.error("Erreur lors de la récupération des paiements:", paiementsError);
    throw paiementsError;
  }

  // 2. Calculer le montant payé total
  const montantPaye = paiements.reduce((total, paiement) => total + paiement.montant, 0);

  // 3. Déterminer le nouveau statut de la facture
  let nouveauStatut: Facture["status"] = "en_attente";
  
  if (montantPaye === 0) {
    nouveauStatut = "en_attente";
  } else if (montantPaye < facture.montant) {
    nouveauStatut = "partiellement_payée";
  } else if (montantPaye >= facture.montant) {
    nouveauStatut = "payée";
  }

  // 4. Mettre à jour la facture
  const { error: updateError } = await supabase
    .from("factures")
    .update({ 
      montant_paye: montantPaye,
      status: nouveauStatut
    })
    .eq("id", factureId);

  if (updateError) {
    console.error("Erreur lors de la mise à jour de la facture:", updateError);
    throw updateError;
  }
}
