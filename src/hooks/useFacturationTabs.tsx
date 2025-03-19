
// Ce hook est conservé pour la rétrocompatibilité mais ne contient plus de fonctionnalité d'onglets
// puisque les onglets "Paiements" et "Situation clients" ont été supprimés et remplacés par une vue unique

export const useFacturationTabs = () => {
  // Retourner des valeurs fictives pour maintenir la compatibilité API avec le code existant
  return {
    activeTab: "factures",
    setActiveTab: () => {}
  };
};
