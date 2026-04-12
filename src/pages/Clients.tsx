
import ClientsPage from "./clients/ClientsPage";
import { useAuthorization } from "@/hooks/useAuthorization";
import { CollaborateurUnauthorized } from "@/components/collaborateurs/CollaborateurUnauthorized";

export default function Clients() {
  const { isAuthorized } = useAuthorization(
    ["admin", "comptable", "gestionnaire", "expert-comptable", "fiscaliste", "assistant"],
    "clients",
    { showToast: true }
  );

  if (!isAuthorized) {
    return <CollaborateurUnauthorized module="clients" />;
  }

  return <ClientsPage />;
}
