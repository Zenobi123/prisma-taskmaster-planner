
export interface Prestation {
  description: string;
  montant: number;
}

export interface Client {
  nom: string;
  id: string;
  adresse: string;
  telephone: string;
  email: string;
}

export interface Facture {
  id: string;
  client: Client;
  date: string;
  echeance: string;
  montant: number;
  status: 'payée' | 'en_attente' | 'envoyée';
  prestations: Prestation[];
}
