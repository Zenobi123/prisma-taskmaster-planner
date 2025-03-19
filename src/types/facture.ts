
export interface Prestation {
  id?: string;
  description: string;
  montant: number;
  quantite?: number;
  taux?: number;
}

export interface Client {
  nom: string;
  id: string;
  adresse: string;
  telephone: string;
  email: string;
  niu?: string;
}

export interface Facture {
  id: string;
  client: Client;
  date: string;
  echeance: string;
  montant: number;
  status: 'payée' | 'en_attente' | 'envoyée';
  prestations: Prestation[];
  reference?: string;
  notes?: string;
  modeReglement?: 'credit' | 'comptant';
  moyenPaiement?: 'especes' | 'orange_money' | 'mtn_mobile' | 'virement';
}
