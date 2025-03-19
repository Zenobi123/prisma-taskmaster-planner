
// Point d'entrée pour les services liés aux factures
// Réexporte toutes les fonctions des modules spécialisés

export {
  fetchFacturesFromDB,
  mapFacturesFromDB
} from './facturesQuery';

export {
  updateFactureStatus,
  enregistrerPaiementPartiel
} from './factureUpdate';

export {
  deleteFactureFromDB
} from './factureDelete';

export {
  createFactureInDB
} from './factureCreate';

export {
  getClientData
} from './clientService';
