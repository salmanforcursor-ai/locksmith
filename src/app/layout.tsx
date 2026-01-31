import type { Metadata } from 'next';
import { Navbar, Footer } from '@/components/layout';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://locksmithnow.ca'),
  title: 'LocksmithNow | Find Verified Locksmiths Near You in Canada',
  description: 'Connect with verified local locksmiths in seconds. Real-time availability, transparent pricing, instant contact. Serving Toronto, Vancouver, Calgary, and more.',
  keywords: 'locksmith, emergency locksmith, lockout service, key replacement, lock repair, Toronto locksmith, Vancouver locksmith, Calgary locksmith',
  authors: [{ name: 'LocksmithNow' }],
  creator: 'LocksmithNow',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://locksmithnow.ca',
    siteName: 'LocksmithNow',
    title: 'LocksmithNow | Find Verified Locksmiths Near You',
    description: 'Connect with verified local locksmiths in seconds. Real-time availability, transparent pricing, instant contact.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LocksmithNow - Find Verified Locksmiths',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LocksmithNow | Find Verified Locksmiths Near You',
    description: 'Connect with verified local locksmiths in seconds.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('locksmithnow-theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased transition-colors duration-300">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
