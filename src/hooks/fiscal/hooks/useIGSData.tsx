
import { useState } from "react";
import { IGSData } from "../types/igsTypes";
import { createDefaultIGSData } from "../types/igsTypes";

export const useIGSData = (initialData?: IGSData) => {
  const [igsData, setIgsData] = useState<IGSData>(initialData || createDefaultIGSData());

  const handleIGSDataChange = (data: IGSData) => {
    setIgsData(data);
  };

  return {
    igsData,
    handleIGSDataChange
  };
};
