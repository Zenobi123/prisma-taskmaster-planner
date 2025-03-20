
import { Facture } from "@/types/facture";
import { Client } from "@/types/client";

// Données d'exemple pour les clients convertis au format Client de @/types/client
export const clientsExemple: Client[] = [
  {
    id: "client1",
    type: "morale",
    niu: "12345678",
    centrerattachement: "Centre Nord",
    adresse: {
      ville: "Douala",
      quartier: "Centre",
      lieuDit: "123 Rue Principale"
    },
    contact: {
      telephone: "694123456",
      email: "contact@societeabc.com"
    },
    raisonsociale: "Société ABC",
    secteuractivite: "Commerce",
    statut: "actif",
    gestionexternalisee: false,
    interactions: []
  },
  {
    id: "client2",
    type: "morale",
    niu: "87654321",
    centrerattachement: "Centre Sud",
    adresse: {
      ville: "Yaoundé",
      quartier: "Ouest",
      lieuDit: "456 Avenue Centrale"
    },
    contact: {
      telephone: "677654321",
      email: "info@xyz.com"
    },
    raisonsociale: "Entreprise XYZ",
    secteuractivite: "Services",
    statut: "actif",
    gestionexternalisee: false,
    interactions: []
  },
  {
    id: "client3",
    type: "morale",
    niu: "98765432",
    centrerattachement: "Centre Ouest",
    adresse: {
      ville: "Bafoussam",
      quartier: "Centre",
      lieuDit: "789 Boulevard Ouest"
    },
    contact: {
      telephone: "698765432",
      email: "cabinet@def.com"
    },
    nom: "Cabinet DEF",
    secteuractivite: "Services",
    statut: "actif",
    gestionexternalisee: false,
    interactions: []
  },
  {
    id: "client4",
    type: "physique",
    niu: "12340987",
    centrerattachement: "Centre Est",
    adresse: {
      ville: "Limbé",
      quartier: "Jardins",
      lieuDit: "101 Rue des Jardins"
    },
    contact: {
      telephone: "651234567",
      email: "dupont@mail.com"
    },
    nom: "M. Dupont",
    secteuractivite: "Commerce",
    statut: "actif",
    gestionexternalisee: false,
    interactions: []
  },
];

// Données d'exemple pour les factures
export const facturesExemple: Facture[] = [
  { 
    id: "F-2023-001", 
    client_id: "client1",
    client: {
      id: "client1",
      nom: "Société ABC",
      adresse: "123 Rue Principale, Douala",
      telephone: "694123456",
      email: "contact@societeabc.com"
    }, 
    date: "15/05/2023",
    echeance: "15/06/2023", 
    montant: 450000, 
    montant_paye: 450000,
    status: "payée",
    mode_paiement: "virement",
    prestations: [
      { description: "Prestation 1", quantite: 1, montant: 250000 },
      { description: "Prestation 2", quantite: 2, montant: 100000 }
    ]
  },
  { 
    id: "F-2023-002", 
    client_id: "client2",
    client: {
      id: "client2",
      nom: "Entreprise XYZ",
      adresse: "456 Avenue Centrale, Yaoundé",
      telephone: "677654321",
      email: "info@xyz.com"
    }, 
    date: "22/05/2023",
    echeance: "22/06/2023", 
    montant: 175000,
    montant_paye: 0, 
    status: "en_attente",
    mode_paiement: "espèces",
    prestations: [
      { description: "Consultation", quantite: 1, montant: 175000 }
    ]
  },
  { 
    id: "F-2023-003", 
    client_id: "client3",
    client: {
      id: "client3",
      nom: "Cabinet DEF",
      adresse: "789 Boulevard Ouest, Bafoussam",
      telephone: "698765432",
      email: "cabinet@def.com"
    }, 
    date: "01/06/2023",
    echeance: "01/07/2023", 
    montant: 325000,
    montant_paye: 150000, 
    status: "partiellement_payée",
    mode_paiement: "orange_money",
    prestations: [
      { description: "Audit comptable", quantite: 1, montant: 325000 }
    ]
  },
  { 
    id: "F-2023-004", 
    client_id: "client4",
    client: {
      id: "client4",
      nom: "M. Dupont",
      adresse: "101 Rue des Jardins, Limbé",
      telephone: "651234567",
      email: "dupont@mail.com"
    }, 
    date: "12/06/2023",
    echeance: "12/07/2023", 
    montant: 85000,
    montant_paye: 0, 
    status: "envoyée",
    mode_paiement: "chèque",
    prestations: [
      { description: "Conseil fiscal", quantite: 1, montant: 85000 }
    ]
  },
  { 
    id: "F-2023-005", 
    client_id: "client2",
    client: {
      id: "client2",
      nom: "Entreprise XYZ",
      adresse: "456 Avenue Centrale, Yaoundé",
      telephone: "677654321",
      email: "info@xyz.com"
    }, 
    date: "05/07/2023",
    echeance: "05/08/2023", 
    montant: 220000,
    montant_paye: 220000, 
    status: "payée",
    mode_paiement: "mtn_mobile_money",
    prestations: [
      { description: "Analyse comptable", quantite: 1, montant: 220000 }
    ]
  },
  { 
    id: "F-2023-006", 
    client_id: "client1",
    client: {
      id: "client1",
      nom: "Société ABC",
      adresse: "123 Rue Principale, Douala",
      telephone: "694123456",
      email: "contact@societeabc.com"
    }, 
    date: "18/07/2023",
    echeance: "18/08/2023", 
    montant: 150000,
    montant_paye: 0, 
    status: "annulée",
    mode_paiement: "virement",
    prestations: [
      { description: "Formation fiscalité", quantite: 1, montant: 150000 }
    ]
  },
  { 
    id: "F-2023-007", 
    client_id: "client3",
    client: {
      id: "client3",
      nom: "Cabinet DEF",
      adresse: "789 Boulevard Ouest, Bafoussam",
      telephone: "698765432",
      email: "cabinet@def.com"
    }, 
    date: "02/08/2023",
    echeance: "02/09/2023", 
    montant: 400000,
    montant_paye: 200000, 
    status: "partiellement_payée",
    mode_paiement: "espèces",
    prestations: [
      { description: "Bilan comptable", quantite: 1, montant: 400000 }
    ]
  },
  { 
    id: "F-2023-008", 
    client_id: "client4",
    client: {
      id: "client4",
      nom: "M. Dupont",
      adresse: "101 Rue des Jardins, Limbé",
      telephone: "651234567",
      email: "dupont@mail.com"
    }, 
    date: "15/08/2023",
    echeance: "15/09/2023", 
    montant: 120000,
    montant_paye: 120000, 
    status: "payée",
    mode_paiement: "orange_money",
    prestations: [
      { description: "Consultation juridique", quantite: 1, montant: 120000 }
    ]
  },
];
