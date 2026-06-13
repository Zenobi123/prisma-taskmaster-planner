
const UNITS = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
const TEENS = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const TENS = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];

// Règles VERBATIM du vanilla (recu-app.html / numberToWords) : liaison de
// l'unité par trait d'union, sans « et » ; « quatre-vingt » invariable.
function convertBelowHundred(n: number): string {
  if (n === 0) return "";
  if (n < 10) return UNITS[n];
  if (n < 20) return TEENS[n - 10];

  const ten = Math.floor(n / 10);
  const unit = n % 10;

  // 70-79 : soixante-dix, soixante-onze, … (sans « et »)
  if (ten === 7) return `soixante-${TEENS[unit]}`;
  // 90-99 : quatre-vingt-dix, quatre-vingt-onze, …
  if (ten === 9) return `quatre-vingt-${TEENS[unit]}`;

  // 20-69 et 80-89 : la dizaine reste invariable, l'unité est liée par un
  // trait d'union (« vingt-un », « quatre-vingt-un »), jamais « et un ».
  return TENS[ten] + (unit ? `-${UNITS[unit]}` : "");
}

// « cent » reste invariable (fidélité vanilla : « deux cent », « cinq cent mille »).
function convertBelowThousand(n: number): string {
  if (n === 0) return "";
  if (n < 100) return convertBelowHundred(n);

  const hundred = Math.floor(n / 100);
  const remainder = n % 100;

  const result = hundred === 1 ? "cent" : `${UNITS[hundred]} cent`;

  if (remainder === 0) return result;
  return `${result} ${convertBelowHundred(remainder)}`;
}

/**
 * Convertit un nombre en toutes lettres en français
 * Supporte les nombres jusqu'à 999 999 999 999
 * @param amount - Le montant à convertir
 * @returns La représentation en lettres du montant
 */
export function numberToWordsFr(amount: number): string {
  if (amount === 0) return "zéro";
  if (amount < 0) return `moins ${numberToWordsFr(-amount)}`;

  // Arrondir à l'entier le plus proche
  const n = Math.round(amount);

  if (n === 0) return "zéro";

  const milliards = Math.floor(n / 1_000_000_000);
  const millions = Math.floor((n % 1_000_000_000) / 1_000_000);
  const milliers = Math.floor((n % 1_000_000) / 1_000);
  const reste = n % 1_000;

  const parts: string[] = [];

  if (milliards > 0) {
    if (milliards === 1) {
      parts.push("un milliard");
    } else {
      parts.push(`${convertBelowThousand(milliards)} milliards`);
    }
  }

  if (millions > 0) {
    if (millions === 1) {
      parts.push("un million");
    } else {
      parts.push(`${convertBelowThousand(millions)} millions`);
    }
  }

  if (milliers > 0) {
    if (milliers === 1) {
      parts.push("mille");
    } else {
      parts.push(`${convertBelowThousand(milliers)} mille`);
    }
  }

  if (reste > 0) {
    parts.push(convertBelowThousand(reste));
  }

  return parts.join(" ");
}

/**
 * Convertit un montant en F CFA en toutes lettres
 * @param amount - Le montant en F CFA
 * @returns Ex: "Cinq cent mille F CFA"
 */
export function montantEnLettres(amount: number): string {
  const words = numberToWordsFr(amount);
  // Mettre la première lettre en majuscule
  const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
  return `${capitalized} F CFA`;
}
