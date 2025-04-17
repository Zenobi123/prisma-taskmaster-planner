
import { useState, useEffect } from "react";
import { IGSData, createDefaultIGSData } from "../types/igsTypes";

export const useIGSData = (initialData?: IGSData) => {
  const [igsData, setIgsData] = useState<IGSData>(initialData || createDefaultIGSData());

  // Update state when initialData changes
  useEffect(() => {
    if (initialData) {
      setIgsData(initialData);
    }
  }, [initialData]);

  const handleIGSDataChange = (data: IGSData) => {
    setIgsData(data);
  };

  return {
    igsData,
    setIgsData,
    handleIGSDataChange
  };
};
