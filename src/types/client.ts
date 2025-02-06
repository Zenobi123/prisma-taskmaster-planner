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
  raisonSociale?: string;
  niu: string;
  centreRattachement: string;
  adresse: {
    ville: string;
    quartier: string;
    lieuDit: string;
  };
  contact: {
    telephone: string;
    email: string;
  };
  secteurActivite: string;
  numeroCnps?: string;
  interactions: Interaction[];
  statut: "actif" | "inactif";
}