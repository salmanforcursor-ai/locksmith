import React from 'react';
import Link from 'next/link';
import { KeyRound, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: 'Find a Locksmith', href: '/' },
            { label: 'For Locksmiths', href: '/for-locksmiths' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'How It Works', href: '/how-it-works' },
        ],
        company: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '/careers' },
            { label: 'Blog', href: '/blog' },
            { label: 'Press', href: '/press' },
        ],
        support: [
            { label: 'Help Center', href: '/help' },
            { label: 'Contact Us', href: '/contact' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
        ],
        cities: [
            { label: 'Toronto', href: '/locksmiths/toronto' },
            { label: 'Vancouver', href: '/locksmiths/vancouver' },
            { label: 'Calgary', href: '/locksmiths/calgary' },
            { label: 'Edmonton', href: '/locksmiths/edmonton' },
        ],
    };

    return (
        <footer className="bg-[var(--background-secondary)] border-t border-[var(--border)]">
            <div className="container mx-auto px-4 py-12 md:py-16">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--secondary-600)] flex items-center justify-center">
                                <KeyRound className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text">LocksmithNow</span>
                        </Link>
                        <p className="text-sm text-[var(--foreground-muted)] mb-4">
                            Connecting Canadians with trusted, verified locksmiths in seconds.
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[var(--surface)] text-[var(--foreground-muted)] hover:text-[var(--primary-400)] hover:bg-[var(--surface-hover)] transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[var(--surface)] text-[var(--foreground-muted)] hover:text-[var(--primary-400)] hover:bg-[var(--surface-hover)] transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="mailto:hello@locksmithnow.ca" className="p-2 rounded-lg bg-[var(--surface)] text-[var(--foreground-muted)] hover:text-[var(--primary-400)] hover:bg-[var(--surface-hover)] transition-colors">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-4">Product</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-4">Company</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-4">Support</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cities */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-4">Top Cities</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.cities.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-[var(--foreground-muted)]">
                        © {currentYear} LocksmithNow. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                            Terms
                        </Link>
                        <Link href="/cookies" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
