
import { Rapport } from "@/types/rapport";

/**
 * Filters reports based on provided filter criteria
 */
export const filterRapports = (
  rapports: Rapport[],
  typeFilter: string,
  searchTerm: string,
  periodFilter: string,
  dateFilter?: Date
): Rapport[] => {
  let filteredRapports = [...rapports];
  
  // Filter by type
  if (typeFilter !== "all") {
    filteredRapports = filteredRapports.filter(r => r.type === typeFilter);
  }
  
  // Filter by search term
  if (searchTerm) {
    filteredRapports = filteredRapports.filter(r => 
      r.titre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Filter by period
  if (periodFilter !== "all") {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    switch (periodFilter) {
      case "this_month":
        filteredRapports = filteredRapports.filter(r => 
          r.createdAt.getMonth() === currentMonth && 
          r.createdAt.getFullYear() === currentYear
        );
        break;
      case "this_year":
        filteredRapports = filteredRapports.filter(r => 
          r.createdAt.getFullYear() === currentYear
        );
        break;
      case "last_year":
        filteredRapports = filteredRapports.filter(r => 
          r.createdAt.getFullYear() === currentYear - 1
        );
        break;
      case "custom":
        if (dateFilter) {
          filteredRapports = filteredRapports.filter(r => {
            const reportDate = new Date(r.createdAt);
            return (
              reportDate.getDate() === dateFilter.getDate() &&
              reportDate.getMonth() === dateFilter.getMonth() &&
              reportDate.getFullYear() === dateFilter.getFullYear()
            );
          });
        }
        break;
    }
  }
  
  // Sort by most recent first
  return filteredRapports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};
