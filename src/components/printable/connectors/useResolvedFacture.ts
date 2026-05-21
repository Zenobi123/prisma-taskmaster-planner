// Résout la facture liée à un paiement (avec ses prestations typées) afin de
// reconstituer la ventilation Impôts / Honoraires du reçu, comme la référence.
import { useQuery } from '@tanstack/react-query';
import { getFactures } from '@/services/factureService';
import type { Facture } from '@/types/facture';

export function useResolvedFacture(factureId?: string): Facture | null {
  const { data } = useQuery({
    queryKey: ['factures'],
    queryFn: getFactures,
    staleTime: 1000 * 60 * 5,
    enabled: !!factureId,
  });

  if (!factureId || !data) return null;
  return data.find((f) => f.id === factureId) ?? null;
}
