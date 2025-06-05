import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);