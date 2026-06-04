import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Map table -> query keys à invalider (ciblé au lieu de tout invalider)
const TABLE_TO_QUERY_KEYS: Record<string, string[]> = {
  clients: ['clients', 'client-stats', 'expiring-fiscal-attestations'],
  factures: ['factures', 'invoices', 'client-stats'],
  paiements: ['paiements', 'payments', 'factures'],
  prestations: ['prestations', 'factures'],
  tasks: ['tasks'],
  fiscal_obligations: ['fiscal-obligations', 'clients-unpaid-igs', 'clients-unpaid-patente', 'clients-unfiled-dsf'],
  devis: ['devis'],
  propositions: ['propositions'],
  courriers: ['courriers'],
  collaborateurs: ['collaborateurs'],
};

export const useAutoUpdate = () => {
  const queryClient = useQueryClient();
  const pendingRef = useRef<Set<string>>(new Set());
  const flushTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const flush = () => {
      const tables = Array.from(pendingRef.current);
      pendingRef.current.clear();
      flushTimerRef.current = null;

      const keysToInvalidate = new Set<string>();
      tables.forEach((table) => {
        const keys = TABLE_TO_QUERY_KEYS[table];
        if (keys) {
          keys.forEach((k) => keysToInvalidate.add(k));
        }
      });

      // Si la table n'est pas connue, on ne fait rien (évite les invalidations globales).
      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    };

    const channel = supabase
      .channel('public:all')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          const table = (payload as { table?: string }).table;
          if (!table) return;
          pendingRef.current.add(table);

          // Debounce: regroupe les invalidations sur 500 ms pour éviter les rafales
          if (flushTimerRef.current === null) {
            flushTimerRef.current = window.setTimeout(flush, 500);
          }
        }
      )
      .subscribe();

    return () => {
      if (flushTimerRef.current !== null) {
        window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
