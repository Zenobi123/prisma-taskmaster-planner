import { Facture } from "@/types/facture";

// Tableau vide pour les factures
export const facturesMockData: Facture[] = [];

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

    // Filtre par période
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
