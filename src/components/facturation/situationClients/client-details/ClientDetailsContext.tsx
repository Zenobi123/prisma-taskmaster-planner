
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
  // Enhance the clientDetails with extra information needed by components
  const enhancedClientDetails = clientDetails ? {
    ...clientDetails,
    // Add client property if not already present
    client: clientDetails.client || {}
  } : null;

  return (
    <ClientDetailsContext.Provider
      value={{
        clientDetails: enhancedClientDetails,
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
