import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dfwmhnwhepwtrbfrfdje.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_UtW6L0TeoWlHOEGMX3grsQ_Jej-5Twx';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
