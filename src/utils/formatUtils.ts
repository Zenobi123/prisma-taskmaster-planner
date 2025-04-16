
export const formatMontant = (montant: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0
  }).format(Math.round(montant)) + " XAF";
};

export const formatNumberWithSpaces = (num: number | string): string => {
  if (num === undefined || num === null) return "";
  
  // Si c'est déjà une chaîne, s'assurer qu'elle ne contient que des chiffres
  const numStr = typeof num === 'string' ? num.replace(/\D/g, "") : num.toString();
  
  // S'il n'y a pas de chiffres, retourner une chaîne vide
  if (!numStr || numStr === '0') return "";
  
  // Formater avec des espaces comme séparateurs de milliers
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
