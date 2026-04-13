import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const FALLBACK_SUPABASE_URL = 'https://xkwqgxqmwxxpzrsurchk.supabase.co';
const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhrd3FneHFtd3h4cHpyc3VyY2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MzU3OTEsImV4cCI6MjA1NDUxMTc5MX0.v5ZDw9R6MESElazvaMkblIoPzX-i9CBNBDDXpU4VgZw';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_SUPABASE_PUBLISHABLE_KEY;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    'Variables d\'environnement Supabase absentes au build : utilisation des valeurs de secours intégrées.'
  );
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
