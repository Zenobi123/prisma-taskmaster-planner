
export const formatMontant = (montant: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0
  }).format(Math.round(montant)) + " XAF";
};

export const formatNumberWithSpaces = (num: number | string): string => {
  if (num === undefined || num === null) return "";
  
  // Si c'est déjà une chaîne, on la renvoie sans formatage
  // pour permettre la saisie sans interférence
  if (typeof num === 'string') return num;
  
  // Si c'est zéro, on retourne une chaîne vide
  if (num === 0) return "";
  
  // Sinon on formate le nombre avec des espaces
  return new Intl.NumberFormat('fr-FR', {
    useGrouping: true,
    maximumFractionDigits: 0
  }).format(num);
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

// Fonction pour convertir une chaîne formatée en nombre
export const parseFormattedNumber = (formattedValue: string): number => {
  // Enlever tous les caractères non numériques
  const numericString = formattedValue.replace(/\D/g, '');
  return numericString ? Number(numericString) : 0;
};
