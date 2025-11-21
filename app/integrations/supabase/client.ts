import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://ggcallxmmlcijpdfgdel.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnY2FsbHhtbWxjaWpwZGZnZGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTAyMjksImV4cCI6MjA2NTY2NjIyOX0.J_1PBFoUWjqZNSCkf91sUEOOZ9eCBII4Rvbck3BH4vA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
