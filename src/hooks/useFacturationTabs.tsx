
import { useState } from "react";

export const useFacturationTabs = () => {
  const [activeTab, setActiveTab] = useState("paiements");
  
  return {
    activeTab,
    setActiveTab
  };
};
