import { ClientDetailsContext, ClientDetailsContextProps } from "./client-details-context";

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
