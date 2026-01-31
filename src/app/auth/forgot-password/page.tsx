'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Button, Input } from '@/components/ui';
import { KeyRound, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { resetPassword } from '@/lib/supabase/auth';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await resetPassword(email);
            
            if (result.error) {
                setError(result.error);
                setLoading(false);
                return;
            }

            setSent(true);
            setLoading(false);
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    if (sent) {
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
                        We&apos;ve sent a password reset link to <strong>{email}</strong>.
                        Click the link to reset your password.
                    </p>
                    <Link href="/auth/login">
                        <Button variant="secondary">
                            Back to Login
                        </Button>
                    </Link>
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
                    <h1 className="text-2xl font-bold mb-2">Forgot your password?</h1>
                    <p className="text-[var(--foreground-secondary)]">
                        No worries, we&apos;ll send you reset instructions.
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

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            size="lg"
                            loading={loading}
                        >
                            Reset Password
                        </Button>
                    </form>

                    <Link
                        href="/auth/login"
                        className="flex items-center justify-center gap-2 mt-6 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                    </Link>
                </Card>
            </div>
        </div>
    );
}
