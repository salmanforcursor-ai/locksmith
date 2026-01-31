'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, Button, Input } from '@/components/ui';
import { KeyRound, Mail, Lock, ArrowRight, Chrome } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = createClient();

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        router.push(redirectTo);
        router.refresh();
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);

        const supabase = createClient();

        const { error: authError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[var(--primary-600)] rounded-full blur-[200px] opacity-20" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[var(--secondary-600)] rounded-full blur-[200px] opacity-20" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--secondary-600)] flex items-center justify-center shadow-lg shadow-purple-500/25">
                            <KeyRound className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold gradient-text">LocksmithNow</span>
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                    <p className="text-[var(--foreground-secondary)]">
                        Sign in to your account to continue
                    </p>
                </div>

                <Card variant="glass" padding="lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<Mail className="w-5 h-5" />}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Lock className="w-5 h-5" />}
                            required
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-[var(--border)] bg-[var(--background-secondary)] text-[var(--primary-600)] focus:ring-[var(--primary-500)]"
                                />
                                <span className="text-[var(--foreground-secondary)]">Remember me</span>
                            </label>
                            <Link
                                href="/auth/forgot-password"
                                className="text-[var(--primary-400)] hover:text-[var(--primary-300)] transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            size="lg"
                            loading={loading}
                            icon={<ArrowRight className="w-5 h-5" />}
                            iconPosition="right"
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border)]" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[rgba(30,30,46,0.6)] text-[var(--foreground-muted)]">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        icon={<Chrome className="w-5 h-5" />}
                    >
                        Sign in with Google
                    </Button>

                    <p className="text-center text-sm text-[var(--foreground-secondary)] mt-6">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/auth/signup"
                            className="text-[var(--primary-400)] hover:text-[var(--primary-300)] font-medium transition-colors"
                        >
                            Sign up free
                        </Link>
                    </p>
                </Card>

                {/* For Locksmith Owners */}
                <div className="mt-6 text-center">
                    <Link
                        href="/for-locksmiths"
                        className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        Are you a locksmith? <span className="text-[var(--neon-cyan)]">Join our network →</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="w-full max-w-md text-center">
                    <div className="animate-pulse text-[var(--foreground-muted)]">Loading...</div>
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
