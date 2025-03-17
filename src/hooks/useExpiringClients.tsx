
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchExpiringClients } from "./expiring/expiringService";
import { ExpiringClient } from "./expiring/types";

export type { ExpiringClient } from "./expiring/types";

export const useExpiringClients = () => {
  const [expiringClients, setExpiringClients] = useState<ExpiringClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpiringClients();
  }, []);

  const loadExpiringClients = async () => {
    try {
      setLoading(true);
      const clients = await fetchExpiringClients();
      setExpiringClients(clients);
    } catch (error) {
      console.error("Error fetching clients with expiring documents:", error);
      toast.error("Erreur lors de la récupération des documents clients");
    } finally {
      setLoading(false);
    }
  };

  return { expiringClients, loading };
};
