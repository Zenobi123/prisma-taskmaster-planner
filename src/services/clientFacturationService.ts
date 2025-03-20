
import { supabase } from "@/integrations/supabase/client";

// Type pour les clients formatés pour la facturation
export interface ClientFacturation {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}

export interface ClientAvecFactures {
  id: string;
  nom: string;
  montantTotal: number;
  montantPaye: number;
  montantDu: number;
  pourcentagePaye: number;
  status: string;
}

export const getClientsFacturation = async (): Promise<ClientFacturation[]> => {
  const { data, error } = await supabase
    .from("clients")
    .select("id, nom, raisonsociale, type, adresse, contact")
    .eq("statut", "actif");

  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw error;
  }

  // Formater les clients pour l'affichage dans la facturation
  return data.map(client => {
    // Traiter l'adresse et le contact de manière sécurisée
    const adresse = client.adresse as Record<string, string>;
    const contact = client.contact as Record<string, string>;
    
    return {
      id: client.id,
      nom: client.type === "physique" ? client.nom : client.raisonsociale,
      adresse: `${adresse.quartier}, ${adresse.ville}`,
      telephone: contact.telephone,
      email: contact.email
    };
  });
};

export const getClientFacturationById = async (id: string): Promise<ClientFacturation> => {
  const { data, error } = await supabase
    .from("clients")
    .select("id, nom, raisonsociale, type, adresse, contact")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération du client:", error);
    throw error;
  }

  // Traiter l'adresse et le contact de manière sécurisée
  const adresse = data.adresse as Record<string, string>;
  const contact = data.contact as Record<string, string>;

  return {
    id: data.id,
    nom: data.type === "physique" ? data.nom : data.raisonsociale,
    adresse: `${adresse.quartier}, ${adresse.ville}`,
    telephone: contact.telephone,
    email: contact.email
  };
};

// Récupérer les clients avec leurs factures pour la vue "Situation clients"
export const getClientsAvecFactures = async (): Promise<ClientAvecFactures[]> => {
  // Ici, nous simulons des données pour l'exemple
  // Dans une application réelle, nous récupérerions ces données depuis la base de données
  const mockClients = [
    {
      id: "1",
      nom: "Entreprise ABC",
      montantTotal: 1250000,
      montantPaye: 750000,
      montantDu: 500000,
      pourcentagePaye: 60,
      status: "partiellement_payée"
    },
    {
      id: "2",
      nom: "Société XYZ",
      montantTotal: 850000,
      montantPaye: 850000,
      montantDu: 0,
      pourcentagePaye: 100,
      status: "payée"
    },
    {
      id: "3",
      nom: "Cabinet Juridique DEF",
      montantTotal: 1500000,
      montantPaye: 0,
      montantDu: 1500000,
      pourcentagePaye: 0,
      status: "en_attente"
    },
    {
      id: "4",
      nom: "Boutique Mode GHI",
      montantTotal: 650000,
      montantPaye: 325000,
      montantDu: 325000,
      pourcentagePaye: 50,
      status: "partiellement_payée"
    },
    {
      id: "5",
      nom: "Restaurant JKL",
      montantTotal: 750000,
      montantPaye: 750000,
      montantDu: 0,
      pourcentagePaye: 100,
      status: "payée"
    }
  ];

  return mockClients;
};
