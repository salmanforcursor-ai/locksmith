'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { KeyRound, Menu, X, User } from 'lucide-react';

interface NavbarProps {
    className?: string;
}

export function Navbar({ className }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Find Locksmith' },
        { href: '/how-it-works', label: 'How It Works' },
        { href: '/for-locksmiths', label: 'For Locksmiths' },
    ];

    return (
        <header className={cn('fixed top-0 left-0 right-0 z-50', className)}>
            <div className="glass border-b border-[var(--border)]">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--secondary-600)] flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
                                    <KeyRound className="w-5 h-5 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
                            </div>
                            <span className="text-xl font-bold gradient-text hidden sm:block">
                                LocksmithNow
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors rounded-lg hover:bg-[var(--surface)]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/auth/login">
                                <Button variant="ghost" size="sm">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button variant="primary" size="sm">
                                    Sign Up Free
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-[var(--border)]">
                        <div className="container mx-auto px-4 py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 space-y-2 border-t border-[var(--border)] mt-2">
                                <Link href="/auth/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="secondary" className="w-full justify-center" icon={<User className="w-4 h-4" />}>
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/auth/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="primary" className="w-full justify-center">
                                        Sign Up Free
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
