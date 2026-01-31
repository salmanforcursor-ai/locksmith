import { createClient } from './client';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthResult {
    user: User | null;
    session: Session | null;
    error: string | null;
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return {
        user: data?.user ?? null,
        session: data?.session ?? null,
        error: error?.message ?? null,
    };
}

export async function signUpWithEmail(
    email: string,
    password: string,
    fullName: string,
    userType: 'consumer' | 'locksmith'
): Promise<AuthResult> {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: userType === 'locksmith' ? 'locksmith_owner' : 'consumer',
            },
        },
    });

    return {
        user: data?.user ?? null,
        session: data?.session ?? null,
        error: error?.message ?? null,
    };
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    return { error: error?.message ?? null };
}

export async function signOut(): Promise<{ error: string | null }> {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    return { error: error?.message ?? null };
}

export async function resetPassword(email: string): Promise<{ error: string | null }> {
    const supabase = createClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    return { error: error?.message ?? null };
}

export async function updatePassword(newPassword: string): Promise<{ error: string | null }> {
    const supabase = createClient();
    
    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    return { error: error?.message ?? null };
}

export async function getCurrentUser(): Promise<User | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getCurrentSession(): Promise<Session | null> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}
