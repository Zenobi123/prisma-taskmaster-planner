
import { createContext, useContext } from "react";
import { ClientFinancialDetails } from "@/types/clientFinancial";

interface ClientDetailsContextProps {
  clientDetails: ClientFinancialDetails | null;
  onOpenApplyCreditDialog: (invoiceId: string) => void;
  onOpenReminderDialog: (invoiceId: string) => void;
}

const ClientDetailsContext = createContext<ClientDetailsContextProps | undefined>(undefined);

export const ClientDetailsProvider = ({
  children,
  clientDetails,
  onOpenApplyCreditDialog,
  onOpenReminderDialog
}: ClientDetailsContextProps & { children: React.ReactNode }) => {
  return (
    <ClientDetailsContext.Provider
      value={{
        clientDetails,
        onOpenApplyCreditDialog,
        onOpenReminderDialog
      }}
    >
      {children}
    </ClientDetailsContext.Provider>
  );
};

export const useClientDetails = () => {
  const context = useContext(ClientDetailsContext);
  if (context === undefined) {
    throw new Error("useClientDetails must be used within a ClientDetailsProvider");
  }
  return context;
};
