
export interface Prestation {
  id?: string;
  description: string;
  montant: number;
  quantite?: number;
  taux?: number;
  estPaye?: boolean;
  datePaiement?: string;
}

export interface Client {
  nom: string;
  id: string;
  adresse: string;
  telephone: string;
  email: string;
  niu?: string;
}

export interface Paiement {
  id: string;
  date: string;
  montant: number;
  mode: string;
  notes?: string;
}

// Type pour les données telles qu'elles sont stockées dans la base de données
export interface FactureDB {
  id: string;
  client_id: string;
  client_nom: string;
  client_adresse: string;
  client_telephone: string;
  client_email: string;
  date: string;
  echeance: string;
  prestations: Prestation[];
  montant: number;
  montant_paye?: number;
  status: 'payée' | 'en_attente' | 'partiellement_payée' | 'envoyée';
  notes?: string;
  paiements?: Paiement[];
  created_at?: string;
}

// Type pour l'interface utilisateur
export interface Facture {
  id: string;
  client: Client;
  date: string;
  echeance: string;
  montant: number;
  montant_paye?: number;
  status: 'payée' | 'en_attente' | 'partiellement_payée' | 'envoyée';
  prestations: Prestation[];
  reference?: string;
  notes?: string;
  paiements?: Paiement[];
}

// Fonctions utilitaires pour convertir entre les formats
export const convertToFacture = (factureDB: FactureDB): Facture => {
  return {
    id: factureDB.id,
    client: {
      id: factureDB.client_id,
      nom: factureDB.client_nom,
      adresse: factureDB.client_adresse,
      telephone: factureDB.client_telephone,
      email: factureDB.client_email
    },
    date: factureDB.date,
    echeance: factureDB.echeance,
    montant: factureDB.montant,
    montant_paye: factureDB.montant_paye,
    status: factureDB.status,
    prestations: factureDB.prestations,
    notes: factureDB.notes,
    paiements: factureDB.paiements
  };
};

export const convertToFactureDB = (facture: Partial<Facture>): Partial<FactureDB> => {
  if (!facture.client) {
    return facture as unknown as Partial<FactureDB>;
  }
  
  return {
    ...(facture.id && { id: facture.id }),
    ...(facture.client && { 
      client_id: facture.client.id,
      client_nom: facture.client.nom,
      client_adresse: facture.client.adresse,
      client_telephone: facture.client.telephone,
      client_email: facture.client.email
    }),
    ...(facture.date && { date: facture.date }),
    ...(facture.echeance && { echeance: facture.echeance }),
    ...(facture.montant !== undefined && { montant: facture.montant }),
    ...(facture.montant_paye !== undefined && { montant_paye: facture.montant_paye }),
    ...(facture.status && { status: facture.status }),
    ...(facture.prestations && { prestations: facture.prestations }),
    ...(facture.notes && { notes: facture.notes }),
    ...(facture.paiements && { paiements: facture.paiements })
  };
};
