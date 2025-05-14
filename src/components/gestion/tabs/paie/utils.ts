
/**
 * Formatte un nombre en une chaîne de caractères représentant un montant en FCFA
 * @param amount Le montant à formatter
 * @returns Le montant formatté
 */
export function formatMoney(amount: number): string {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Formatte un montant en devise avec le symbole FCFA
 * @param amount Le montant à formatter
 * @returns La chaîne formatée avec le symbole FCFA
 */
export function formatCurrency(amount: number): string {
  return `${formatMoney(amount)} FCFA`;
}

/**
 * Formatte une date ISO en format français (JJ/MM/AAAA)
 * @param dateString La chaîne de date ISO à formatter
 * @returns La date formattée
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
}

/**
 * Génère un identifiant unique
 * @returns Un identifiant unique basé sur l'heure courante
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
