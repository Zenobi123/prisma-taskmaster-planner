
export const calculateIGSClass = (revenue: number): { classNumber: number; amount: number } => {
  // Ensure revenue is a number and not NaN
  const safeRevenue = isNaN(revenue) ? 0 : revenue;
  
  if (safeRevenue < 500000) return { classNumber: 1, amount: 20000 };
  if (safeRevenue < 1000000) return { classNumber: 2, amount: 30000 };
  if (safeRevenue < 1500000) return { classNumber: 3, amount: 40000 };
  if (safeRevenue < 2000000) return { classNumber: 4, amount: 50000 };
  if (safeRevenue < 2500000) return { classNumber: 5, amount: 60000 };
  if (safeRevenue < 5000000) return { classNumber: 6, amount: 150000 };
  if (safeRevenue < 10000000) return { classNumber: 7, amount: 300000 };
  if (safeRevenue < 20000000) return { classNumber: 8, amount: 500000 };
  if (safeRevenue < 30000000) return { classNumber: 9, amount: 1000000 };
  if (safeRevenue < 50000000) return { classNumber: 10, amount: 2000000 };
  return { classNumber: 10, amount: 2000000 };
};
