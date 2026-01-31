'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, Button, Input } from '@/components/ui';
import { KeyRound, Mail, Lock, User, ArrowRight, Chrome, CheckCircle } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [userType, setUserType] = useState<'consumer' | 'locksmith'>('consumer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'form' | 'verify'>('form');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        const supabase = createClient();

        const { error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullName,
                    role: userType === 'locksmith' ? 'locksmith_owner' : 'consumer',
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        setStep('verify');
        setLoading(false);
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        setError(null);

        const supabase = createClient();

        const { error: authError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
        }
    };

    if (step === 'verify') {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[var(--primary-600)] rounded-full blur-[200px] opacity-20" />

                <Card variant="glass" padding="lg" className="max-w-md w-full relative z-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--success)]/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-[var(--success)]" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Check your email</h1>
                    <p className="text-[var(--foreground-secondary)] mb-6">
                        We&apos;ve sent a verification link to <strong>{formData.email}</strong>.
                        Click the link to verify your account.
                    </p>
                    <Button variant="secondary" onClick={() => router.push('/auth/login')}>
                        Back to Login
                    </Button>
                </Card>
            </div>
        );
    }

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
                    <h1 className="text-2xl font-bold mb-2">Create your account</h1>
                    <p className="text-[var(--foreground-secondary)]">
                        Start finding trusted locksmiths near you
                    </p>
                </div>

                <Card variant="glass" padding="lg">
                    {/* User Type Toggle */}
                    <div className="flex gap-2 p-1 bg-[var(--background-secondary)] rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setUserType('consumer')}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${userType === 'consumer'
                                    ? 'bg-gradient-to-r from-[var(--primary-600)] to-[var(--secondary-600)] text-white shadow-lg'
                                    : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            Need a Locksmith
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('locksmith')}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${userType === 'locksmith'
                                    ? 'bg-gradient-to-r from-[var(--primary-600)] to-[var(--secondary-600)] text-white shadow-lg'
                                    : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            I&apos;m a Locksmith
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Full Name"
                            name="fullName"
                            type="text"
                            placeholder="Your name"
                            value={formData.fullName}
                            onChange={handleChange}
                            icon={<User className="w-5 h-5" />}
                            required
                        />

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            icon={<Mail className="w-5 h-5" />}
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            icon={<Lock className="w-5 h-5" />}
                            hint="Minimum 8 characters"
                            required
                        />

                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            icon={<Lock className="w-5 h-5" />}
                            required
                        />

                        <div className="text-sm text-[var(--foreground-secondary)]">
                            By signing up, you agree to our{' '}
                            <Link href="/terms" className="text-[var(--primary-400)] hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-[var(--primary-400)] hover:underline">
                                Privacy Policy
                            </Link>
                            .
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
                            {userType === 'locksmith' ? 'Create Locksmith Account' : 'Create Account'}
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
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        icon={<Chrome className="w-5 h-5" />}
                    >
                        Sign up with Google
                    </Button>

                    <p className="text-center text-sm text-[var(--foreground-secondary)] mt-6">
                        Already have an account?{' '}
                        <Link
                            href="/auth/login"
                            className="text-[var(--primary-400)] hover:text-[var(--primary-300)] font-medium transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
}
