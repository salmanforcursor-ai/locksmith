import React from 'react';
import Link from 'next/link';
import { KeyRound, Shield, Lock, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui';

export const metadata = {
    title: 'Privacy Policy - LocksmithNow',
    description: 'Privacy Policy for LocksmithNow - How we collect, use, and protect your data.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="absolute inset-0 bg-grid opacity-30" />
            
            <div className="container mx-auto max-w-4xl relative z-10">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <Card variant="glass" padding="lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--secondary-600)] flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Privacy Policy</h1>
                            <p className="text-[var(--foreground-muted)]">Last updated: January 31, 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none space-y-6 text-[var(--foreground-secondary)]">
                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">1. Introduction</h2>
                            <p>
                                LocksmithNow (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">2. Information We Collect</h2>
                            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">Personal Information</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Name and contact information (email, phone number)</li>
                                <li>Location data (with your consent) to find nearby locksmiths</li>
                                <li>Account credentials if you create an account</li>
                                <li>Service requests and communication history</li>
                            </ul>
                            
                            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2 mt-4">Automatically Collected Information</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Device and browser information</li>
                                <li>IP address and approximate location</li>
                                <li>Usage data and analytics</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">3. How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To connect you with locksmith service providers</li>
                                <li>To process and manage your service requests</li>
                                <li>To communicate with you about our services</li>
                                <li>To improve our platform and user experience</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">4. Information Sharing</h2>
                            <p>
                                We share your information with locksmith service providers only when you request their services. We do not sell your personal information to third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">5. Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">6. Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access your personal data</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Withdraw consent for data processing</li>
                                <li>Data portability</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">7. Contact Us</h2>
                            <p>
                                If you have questions about this Privacy Policy, please contact us at:{' '}
                                <a href="mailto:privacy@locksmithnow.ca" className="text-[var(--primary-400)] hover:underline">
                                    privacy@locksmithnow.ca
                                </a>
                            </p>
                        </section>
                    </div>
                </Card>
            </div>
        </div>
    );
}
