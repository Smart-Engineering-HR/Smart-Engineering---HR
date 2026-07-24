import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// استخدام Singleton Pattern لمنع تكرار إنشاء العميل
let supabase;

if (supabaseUrl && supabaseAnonKey) {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
}

export { supabase };