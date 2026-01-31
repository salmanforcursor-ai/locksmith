import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui';

export const metadata = {
    title: 'Terms of Service - LocksmithNow',
    description: 'Terms of Service for using LocksmithNow platform.',
};

export default function TermsPage() {
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
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Terms of Service</h1>
                            <p className="text-[var(--foreground-muted)]">Last updated: January 31, 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none space-y-6 text-[var(--foreground-secondary)]">
                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using LocksmithNow (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">2. Description of Service</h2>
                            <p>
                                LocksmithNow is a platform that connects consumers with locksmith service providers. We do not provide locksmith services directly. We facilitate connections between users seeking services and independent locksmith professionals.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">3. User Accounts</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You must provide accurate and complete information when creating an account</li>
                                <li>You are responsible for maintaining the security of your account</li>
                                <li>You must notify us immediately of any unauthorized access</li>
                                <li>You must be at least 18 years old to use this Service</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">4. Service Provider Terms</h2>
                            <p>
                                Locksmith service providers listed on our platform are independent contractors. LocksmithNow does not employ these providers and is not responsible for their work quality, pricing, or conduct.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">5. User Conduct</h2>
                            <p>You agree not to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Use the Service for any unlawful purpose</li>
                                <li>Harass, abuse, or harm other users or service providers</li>
                                <li>Provide false or misleading information</li>
                                <li>Interfere with the proper functioning of the Service</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">6. Limitation of Liability</h2>
                            <p>
                                LocksmithNow is not liable for any damages arising from your use of the Service, including but not limited to direct, indirect, incidental, or consequential damages. We do not guarantee the quality of services provided by listed locksmiths.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">7. Modifications</h2>
                            <p>
                                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the Service. Continued use after modifications constitutes acceptance of the updated Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">8. Governing Law</h2>
                            <p>
                                These Terms are governed by the laws of Ontario, Canada. Any disputes shall be resolved in the courts of Ontario.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">9. Contact</h2>
                            <p>
                                For questions about these Terms, contact us at:{' '}
                                <a href="mailto:legal@locksmithnow.ca" className="text-[var(--primary-400)] hover:underline">
                                    legal@locksmithnow.ca
                                </a>
                            </p>
                        </section>
                    </div>
                </Card>
            </div>
        </div>
    );
}
