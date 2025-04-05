
interface IGSRate {
  classe: number;
  fourchette: string;
  montantStandard: number;
  montantReduit: number;
}

// Tableau des barèmes IGS
export const igsRates: IGSRate[] = [
  {
    classe: 1,
    fourchette: "Moins de 500 000",
    montantStandard: 20000,
    montantReduit: 10000
  },
  {
    classe: 2,
    fourchette: "De 500 000 à 999 999",
    montantStandard: 30000,
    montantReduit: 15000
  },
  {
    classe: 3,
    fourchette: "De 1 000 000 à 1 499 999",
    montantStandard: 40000,
    montantReduit: 20000
  },
  {
    classe: 4,
    fourchette: "De 1 500 000 à 1 999 999",
    montantStandard: 50000,
    montantReduit: 25000
  },
  {
    classe: 5,
    fourchette: "De 2 000 000 à 2 499 999",
    montantStandard: 60000,
    montantReduit: 30000
  },
  {
    classe: 6,
    fourchette: "De 2 500 000 à 4 999 999",
    montantStandard: 150000,
    montantReduit: 75000
  },
  {
    classe: 7,
    fourchette: "De 5 000 000 à 9 999 999",
    montantStandard: 300000,
    montantReduit: 150000
  },
  {
    classe: 8,
    fourchette: "De 10 000 000 à 19 999 999",
    montantStandard: 500000,
    montantReduit: 250000
  },
  {
    classe: 9,
    fourchette: "De 20 000 000 à 29 999 999",
    montantStandard: 1000000,
    montantReduit: 500000
  },
  {
    classe: 10,
    fourchette: "De 30 000 000 à 49 999 999",
    montantStandard: 2000000,
    montantReduit: 1000000
  }
];

/**
 * Calcule le montant IGS en fonction de la classe et de l'adhésion au CGA
 * @param classe Classe IGS (1-10)
 * @param isMemberCGA Si le contribuable est membre d'un CGA
 * @returns Le montant IGS calculé
 */
export const calculateIGSAmount = (classe?: number, isMemberCGA?: boolean): number | undefined => {
  if (!classe) return undefined;
  
  const rateInfo = igsRates.find(rate => rate.classe === classe);
  if (!rateInfo) return undefined;
  
  return isMemberCGA ? rateInfo.montantReduit : rateInfo.montantStandard;
};

/**
 * Formate un montant en FCFA avec séparateur de milliers
 * @param amount Montant à formater
 * @returns Montant formaté avec séparateur de milliers et devise FCFA
 */
export const formatAmount = (amount?: number): string => {
  if (amount === undefined) return "";
  return new Intl.NumberFormat('fr-FR').format(amount) + " FCFA";
};

/**
 * Récupère la fourchette de chiffre d'affaires pour une classe donnée
 * @param classe Classe IGS (1-10)
 * @returns La fourchette de chiffre d'affaires ou une chaîne vide si non trouvée
 */
export const getCAFourchette = (classe?: number): string => {
  if (!classe) return "";
  const rateInfo = igsRates.find(rate => rate.classe === classe);
  return rateInfo ? rateInfo.fourchette : "";
};
