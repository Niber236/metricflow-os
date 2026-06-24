import { createClient } from '@supabase/supabase-js';

// 1. On récupère les clés du fichier .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 2. On crée le "tuyau" et on l'appelle 'supabase' (et pas supabaseUrl !)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);