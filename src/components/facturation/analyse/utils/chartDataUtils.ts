
import { ChartDataItem, MonthlyChartItem } from "../types/AnalyseTypes";

export const prepareStatusChartData = (facturesParStatut: {
  payées: number;
  partiellementPayées: number;
  nonPayées: number;
  enRetard: number;
}): ChartDataItem[] => {
  return [
    { name: 'Payées', value: facturesParStatut.payées },
    { name: 'Partiellement payées', value: facturesParStatut.partiellementPayées },
    { name: 'Non payées', value: facturesParStatut.nonPayées },
    { name: 'En retard', value: facturesParStatut.enRetard }
  ];
};

export const prepareMonthlyChartData = (
  filteredFactures: any[],
): MonthlyChartItem[] => {
  const monthlyChartData: MonthlyChartItem[] = [];
  
  // Get last 6 months
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() - i);
    
    const monthName = monthDate.toLocaleString('fr-FR', { month: 'short' });
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    
    // Filter factures for this month
    const monthFactures = filteredFactures.filter(f => {
      const factureDate = new Date(f.date);
      return factureDate.getMonth() === month && factureDate.getFullYear() === year;
    });
    
    const monthTotal = monthFactures.reduce(
      (sum, f) => sum + parseFloat(f.montant.toString()), 0
    );
    const monthPaid = monthFactures.reduce(
      (sum, f) => sum + parseFloat((f.montant_paye || 0).toString()), 0
    );
    
    monthlyChartData.push({
      name: monthName,
      facturé: monthTotal,
      encaissé: monthPaid
    });
  }
  
  return monthlyChartData;
};
