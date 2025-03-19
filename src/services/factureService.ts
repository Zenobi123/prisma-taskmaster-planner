
// Ce fichier réexporte toutes les fonctions des modules de facture
// pour maintenir la rétrocompatibilité.

import { generateFactureId } from './factures/utils';
import { createFacture } from './factures/createFacture';
import { getFactures } from './factures/getFactures';
import { getFactureById } from './factures/getFactureById';
import { updateFacture } from './factures/updateFacture';
import { deleteFacture } from './factures/deleteFacture';
import { enregistrerPaiement } from './factures/enregistrerPaiement';

// Réexporter toutes les fonctions
export {
  generateFactureId,
  createFacture,
  getFactures,
  getFactureById,
  updateFacture,
  deleteFacture,
  enregistrerPaiement
};

// Réexporter le type FacturesFilters pour maintenir la compatibilité
export type { FacturesFilters } from './factures/getFactures';
