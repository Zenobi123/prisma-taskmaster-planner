
export type ClientType = "physique" | "morale";

export interface Interaction {
  id: string;
  date: string;
  description: string;
}

export interface Client {
  id: string;
  type: ClientType;
  nom?: string;
  raisonsociale?: string;
  niu: string;
  centrerattachement: string;
  adresse: {
    ville: string;
    quartier: string;
    lieuDit: string;
  };
  contact: {
    telephone: string;
    email: string;
  };
  secteuractivite: string;
  numerocnps?: string;
  interactions: Interaction[];
  statut: "actif" | "inactif";
  gestionexternalisee: boolean;
  created_at?: string;
}
