// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xkwqgxqmwxxpzrsurchk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhrd3FneHFtd3h4cHpyc3VyY2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MzU3OTEsImV4cCI6MjA1NDUxMTc5MX0.v5ZDw9R6MESElazvaMkblIoPzX-i9CBNBDDXpU4VgZw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);