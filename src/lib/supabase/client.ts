import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check for env vars only in browser to avoid build errors
const isBrowser = typeof window !== 'undefined';

export function createClient() {
    if (!supabaseUrl || !supabaseAnonKey) {
        if (isBrowser) {
            console.warn('Supabase environment variables are not set. Authentication features will not work.');
        }
        // Return a mock client that won't crash but won't work either
        // This allows the app to build and run without Supabase configured
        return createBrowserClient(
            supabaseUrl || 'https://placeholder.supabase.co',
            supabaseAnonKey || 'placeholder-key'
        );
    }
    
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
