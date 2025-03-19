
// This hook is kept for backward compatibility but no longer contains tab functionality
// since Paiements and Situation clients tabs have been removed

export const useFacturationTabs = () => {
  // Return dummy values to maintain API compatibility with existing code
  return {
    activeTab: "",
    setActiveTab: () => {}
  };
};
