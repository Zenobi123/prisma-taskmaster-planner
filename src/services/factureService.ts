
// Ce fichier est maintenu pour la rétrocompatibilité
// Il réexporte toutes les fonctions depuis le module facture

export {
  fetchFacturesFromDB,
  updateFactureStatus,
  deleteFactureFromDB,
  createFactureInDB,
  getClientData,
  enregistrerPaiementPartiel,
  mapFacturesFromDB
} from './facture';
