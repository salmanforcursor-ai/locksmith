'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button, ThemeToggle } from '@/components/ui';
import { KeyRound, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const navLinks = [
    { href: '/', label: 'Find Locksmith' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/for-locksmiths', label: 'For Locksmiths' },
];

export function Navbar() {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        // Get initial session
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setShowUserMenu(false);
        router.push('/');
        router.refresh();
    };

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-[var(--surface)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-lg'
                    : 'bg-transparent'
            )}
        >
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--secondary-600)] flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
                        <KeyRound className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-[var(--primary-400)] to-[var(--secondary-400)] bg-clip-text text-transparent">
                        LocksmithNow
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors text-sm font-medium"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth + Theme Toggle */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Theme Toggle */}
                    <ThemeToggle variant="navbar" />

                    {loading ? (
                        <div className="w-20 h-9 bg-[var(--surface)] rounded-lg animate-pulse" />
                    ) : user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors"
                            >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary-600)] to-[var(--secondary-600)] flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm font-medium max-w-[120px] truncate">
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </span>
                            </button>

                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden">
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--error)] hover:bg-[var(--surface-hover)] transition-colors w-full"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>

                {/* Mobile: Theme Toggle + Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    <ThemeToggle variant="navbar" />
                    <button
                        className="p-2 text-[var(--foreground)]"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[var(--surface)]/95 backdrop-blur-xl border-b border-[var(--border)]">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block py-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-[var(--border)] space-y-3">
                            {user ? (
                                <>
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="secondary" className="w-full">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="secondary" className="w-full">
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="primary" className="w-full">
                                            Sign Up Free
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
