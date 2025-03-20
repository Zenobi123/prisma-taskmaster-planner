
export const formatMontant = (montant: number): string => {
  return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
};
