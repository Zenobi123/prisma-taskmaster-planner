import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAutoUpdate = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Listen to changes on all tables in the public schema
    const channel = supabase
      .channel('public:all')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Change received!', payload);
          // Invalidate all queries to trigger a refetch
          // This will automatically update the UI without needing a page refresh
          queryClient.invalidateQueries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
