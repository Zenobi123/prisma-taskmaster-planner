
import { useState } from "react";

export const useFacturationTabs = () => {
  const [activeTab, setActiveTab] = useState("factures");
  
  return {
    activeTab,
    setActiveTab
  };
};
