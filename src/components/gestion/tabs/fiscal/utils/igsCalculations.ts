
export const calculateIGSClass = (revenue: number): { classNumber: number; amount: number } => {
  if (revenue < 500000) return { classNumber: 1, amount: 20000 };
  if (revenue < 1000000) return { classNumber: 2, amount: 30000 };
  if (revenue < 1500000) return { classNumber: 3, amount: 40000 };
  if (revenue < 2000000) return { classNumber: 4, amount: 50000 };
  if (revenue < 2500000) return { classNumber: 5, amount: 60000 };
  if (revenue < 5000000) return { classNumber: 6, amount: 150000 };
  if (revenue < 10000000) return { classNumber: 7, amount: 300000 };
  if (revenue < 20000000) return { classNumber: 8, amount: 500000 };
  if (revenue < 30000000) return { classNumber: 9, amount: 1000000 };
  if (revenue < 50000000) return { classNumber: 10, amount: 2000000 };
  return { classNumber: 10, amount: 2000000 };
};
