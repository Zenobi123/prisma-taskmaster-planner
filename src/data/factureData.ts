
import { Facture } from "@/types/facture";

// Données mockées pour l'exemple
export const facturesMockData: Facture[] = [
  {
    id: "F2024-001",
    client: {
      nom: "SARL TechPro",
      id: "client-001",
      adresse: "12 Rue Tech, Yaoundé",
      telephone: "+237 1234567890",
      email: "contact@techpro.cm"
    },
    date: "2024-02-15",
    echeance: "2024-03-15",
    montant: 2500000,
    status: "payée",
    prestations: [
      { description: "Tenue comptable mensuelle", montant: 1500000 },
      { description: "Établissement des états financiers", montant: 1000000 }
    ]
  },
  {
    id: "F2024-002",
    client: {
      nom: "SAS WebDev",
      id: "client-002",
      adresse: "45 Av. Digitale, Douala",
      telephone: "+237 9876543210",
      email: "info@webdev.cm"
    },
    date: "2024-02-10",
    echeance: "2024-03-10",
    montant: 1800000,
    status: "en_attente",
    prestations: [
      { description: "Conseil fiscal", montant: 800000 },
      { description: "Préparation déclarations fiscales", montant: 1000000 }
    ]
  },
  {
    id: "F2024-003",
    client: {
      nom: "EURL ConseilPlus",
      id: "client-003",
      adresse: "8 Blvd Central, Garoua",
      telephone: "+237 5554443330",
      email: "service@conseilplus.cm"
    },
    date: "2024-02-05",
    echeance: "2024-03-05",
    montant: 3200000,
    status: "envoyée",
    prestations: [
      { description: "Audit comptable", montant: 2000000 },
      { description: "Optimisation fiscale", montant: 1200000 }
    ]
  },
];

export const filterFactures = (
  factures: Facture[],
  searchTerm: string,
  statusFilter: string,
  periodFilter: string
): Facture[] => {
  return factures.filter((facture) => {
    const matchesSearch =
      facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || facture.status === statusFilter;

    // Filtre par période (simple pour l'exemple)
    const factureDate = new Date(facture.date);
    const currentDate = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(currentDate.getMonth() - 1);
    const lastThreeMonths = new Date();
    lastThreeMonths.setMonth(currentDate.getMonth() - 3);
    
    let matchesPeriod = true;
    if (periodFilter === "this_month") {
      matchesPeriod = factureDate.getMonth() === currentDate.getMonth() && 
                      factureDate.getFullYear() === currentDate.getFullYear();
    } else if (periodFilter === "last_month") {
      matchesPeriod = factureDate.getMonth() === lastMonth.getMonth() && 
                      factureDate.getFullYear() === lastMonth.getFullYear();
    } else if (periodFilter === "last_three_months") {
      matchesPeriod = factureDate >= lastThreeMonths;
    }

    return matchesSearch && matchesStatus && matchesPeriod;
  });
};

export const formatMontant = (montant: number): string => {
  return `${montant.toLocaleString()} F CFA`;
};
