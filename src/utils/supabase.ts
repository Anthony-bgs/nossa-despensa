import { createClient } from '@supabase/supabase-js';
import * as constantes from '../Helper/constantes';

const supabaseUrl = constantes.SUPABASE_URL;
const supabaseKey = constantes.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});