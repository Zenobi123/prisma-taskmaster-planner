// Résumé fiscal d'un client pour l'affichage (fiche client, liste, profil).
//
// Ce module NE contient aucune logique de calcul : il délègue intégralement au
// moteur fiscal canonique `src/lib/spec/fiscal.ts` (via `adaptClient` +
// `computeAllTaxes`), garantissant que les montants affichés sur la fiche client
// sont strictement identiques à ceux des documents (factures, devis, rapports).
//
// Historique : remplace l'ancien `src/utils/fiscalCalculations.ts` dont les
// barèmes (TDL) et formules (Solde IR) divergeaient du moteur canonique.

import {
  adaptClient,
  computeAllTaxes,
  formatMoney,
  type FullFiscalResult,
  type ExistingClientLike,
} from "@/lib/spec/fiscal";

export type { FullFiscalResult };
export { formatMoney };

/**
 * Champs nécessaires au calcul fiscal d'un client. Un objet `Client` complet
 * satisfait structurellement cette interface ; les écrans qui ne disposent que
 * des primitives (ex. formulaire) peuvent ne renseigner que ces champs.
 */
export type ClientFiscalInput = Pick<
  ExistingClientLike,
  | "type"
  | "regimefiscal"
  | "chiffreaffaires"
  | "iscga"
  | "isvendeurboissons"
  | "modepaiementigs"
  | "modepaiementpsl"
  | "situationimmobiliere"
>;

/**
 * Calcule l'ensemble des taxes d'un client via le moteur fiscal canonique.
 */
export function computeClientTaxes(input: ClientFiscalInput): FullFiscalResult {
  return computeAllTaxes(adaptClient({ id: 0, ...input }));
}
