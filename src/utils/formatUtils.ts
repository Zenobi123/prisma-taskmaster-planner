
export const formatMontant = (montant: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0
  }).format(Math.round(montant)) + " XAF";
};

// Format a date string or Date object to a localized date string
export const formatDate = (date: string | Date): string => {
  if (date instanceof Date) {
    return date.toLocaleDateString('fr-FR');
  }
  
  // If it's already a formatted date string, just return it
  if (typeof date === 'string' && date.includes('/')) {
    return date;
  }
  
  // Otherwise convert date string to Date object and format
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('fr-FR');
};

// Format a number with thousand separators for better readability
export const formatNumberWithSeparator = (value: number): string => {
  return new Intl.NumberFormat('fr-FR').format(value);
};
