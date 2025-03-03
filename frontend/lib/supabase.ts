import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Make sure these environment variables are properly set in your .env file
const supabaseUrl = 'https://armtxpqqrjmyvxesafqi.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 