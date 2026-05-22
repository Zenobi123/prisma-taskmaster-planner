import { createContext, useContext } from "react";
import { ClientFinancialDetails } from "@/types/clientFinancial";

export interface ClientDetailsContextProps {
  clientDetails: ClientFinancialDetails | null;
  onOpenApplyCreditDialog: (invoiceId: string) => void;
  onOpenReminderDialog: (invoiceId: string) => void;
}

export const ClientDetailsContext = createContext<ClientDetailsContextProps | undefined>(undefined);

export const useClientDetails = () => {
  const context = useContext(ClientDetailsContext);
  if (context === undefined) {
    throw new Error("useClientDetails must be used within a ClientDetailsProvider");
  }
  return context;
};
