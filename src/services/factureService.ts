
// Ce fichier réexporte toutes les fonctionnalités des services spécialisés
// pour maintenir la compatibilité avec le code existant

export {
  getFactures,
  getFactureById,
  createFacture,
  updateFacture,
  deleteFacture
} from "./facturation/factureService";

export {
  addPaiement,
  deletePaiement,
  getPaiementsByFactureId,
  updatePaiement
} from "./facturation/paiementService";

export {
  getPrestationsByFactureId,
  createPrestation,
  updatePrestation,
  deletePrestation
} from "./facturation/prestationService";

export {
  updateMontantPayeEtStatut,
  mapStatusToValidEnum
} from "./facturation/factureBaseService";
