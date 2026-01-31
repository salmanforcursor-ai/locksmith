import React from 'react';
import Link from 'next/link';
import { KeyRound, ArrowLeft, Clock } from 'lucide-react';
import { Card, Button } from '@/components/ui';

interface ComingSoonPageProps {
    title: string;
    description: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[var(--primary-600)] rounded-full blur-[200px] opacity-20" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[var(--secondary-600)] rounded-full blur-[200px] opacity-20" />

            <div className="w-full max-w-lg relative z-10 text-center">
                {/* Logo */}
                <Link href="/" className="inline-flex items-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--secondary-600)] flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <KeyRound className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold gradient-text">LocksmithNow</span>
                </Link>

                <Card variant="glass" padding="lg">
                    <div className="w-20 h-20 rounded-full bg-[var(--primary-600)]/20 flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-[var(--primary-400)]" />
                    </div>
                    
                    <h1 className="text-3xl font-bold mb-4">{title}</h1>
                    <p className="text-[var(--foreground-secondary)] mb-8 max-w-md mx-auto">
                        {description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
                                Back to Home
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button variant="secondary">
                                Find a Locksmith
                            </Button>
                        </Link>
                    </div>
                </Card>

                <p className="mt-8 text-sm text-[var(--foreground-muted)]">
                    Have questions? Email us at{' '}
                    <a href="mailto:hello@locksmithnow.ca" className="text-[var(--primary-400)] hover:underline">
                        hello@locksmithnow.ca
                    </a>
                </p>
            </div>
        </div>
    );
}

export default ComingSoonPage;
