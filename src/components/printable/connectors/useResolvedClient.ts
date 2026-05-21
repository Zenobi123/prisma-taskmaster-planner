// Résout le client complet (NIU, ville, quartier, civilité…) à partir de son id
// pour que les rapports imprimables soient aussi fidèles que la référence.
// Les entités (facture/devis/proposition/paiement) n'embarquent qu'un client partiel.
import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/services/clientService';
import type { Client } from '@/types/client';

export function useResolvedClient(
  clientId?: string,
  explicit?: Client | null,
): Client | null {
  const { data } = useQuery({
    queryKey: ['clients'],
    queryFn: () => getClients(false),
    staleTime: 1000 * 60 * 5,
    enabled: !explicit && !!clientId,
  });

  if (explicit) return explicit;
  if (!clientId || !data) return null;
  return data.find((c) => c.id === clientId) ?? null;
}
