
import ClientsPage from "./clients/ClientsPage";
import { ConfirmationProvider } from "./clients/hooks/confirmation/ConfirmationDialogContext";

export default function Clients() {
  return (
    <ConfirmationProvider>
      <ClientsPage />
    </ConfirmationProvider>
  );
}
