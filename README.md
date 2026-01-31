# LocksmithNow 🔐

> Find a locksmith available now. Trusted. Verified. Fast.

A production-ready Canadian locksmith discovery and booking platform built with Next.js 15, TypeScript, and Supabase.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Supabase](https://img.shields.io/badge/Supabase-Ready-green)

## 🚀 Features

### For Consumers
- **Geolocation-based search** - Find locksmiths near you sorted by distance
- **Real-time availability** - See who's available right now
- **Verified professionals** - Trust badges for licensed, insured locksmiths
- **Instant contact** - Call, message, or request quotes directly
- **Reviews & ratings** - Make informed decisions
- **Save favorites** - Quick access to trusted locksmiths

### For Locksmith Owners
- **Business profile** - Showcase services, pricing, and credentials
- **Lead management** - Receive and track incoming requests
- **Availability control** - Toggle status in real-time
- **Analytics dashboard** - Track views, leads, and conversions
- **Premium plans** - Featured placement for more visibility

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL + PostGIS, Auth, RLS, Realtime)
- **State**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📦 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Login, signup pages
│   ├── for-locksmiths/    # B2B landing page
│   ├── locksmiths/[id]/   # Locksmith profile pages
│   ├── search/            # Search results page
│   ├── globals.css        # Design system & global styles
│   ├── layout.tsx         # Root layout with Navbar/Footer
│   └── page.tsx           # Home page
├── components/
│   ├── home/              # Hero, Features, CTA sections
│   ├── layout/            # Navbar, Footer
│   ├── locksmith/         # LocksmithCard, profile components
│   └── ui/                # Button, Card, Input, Badge
├── hooks/                  # Custom React hooks
│   └── useGeolocation.ts  # Browser geolocation hook
├── lib/
│   ├── supabase/          # Supabase client (browser & server)
│   ├── mock-data.ts       # Development mock data
│   └── utils.ts           # Utility functions
└── types/
    └── database.types.ts  # TypeScript type definitions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/locksmithnow.git
   cd locksmithnow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

The project uses a custom purple/blue/neon SaaS aesthetic:

- **Primary**: Purple gradient (`#7c3aed` → `#3b82f6`)
- **Neon accents**: Cyan (`#00f5ff`), Pure purple (`#bf00ff`)
- **Dark theme**: Deep backgrounds with glass morphism effects
- **Typography**: Inter font family

Key CSS classes:
- `.gradient-text` - Purple to blue gradient text
- `.glass` - Glass morphism card effect
- `.glow-purple` / `.glow-cyan` - Neon glow shadows
- `.badge-available` / `.badge-verified` - Status badges

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with search, features, how-it-works |
| `/search` | Search results with filters and map view |
| `/locksmiths/[id]` | Locksmith profile with reviews and contact |
| `/auth/login` | User login page |
| `/auth/signup` | User registration (consumer or locksmith) |
| `/for-locksmiths` | B2B landing page with pricing |

## 🗄️ Database Schema (Supabase)

Key tables (full DDL in implementation plan):
- `profiles` - User profiles with roles
- `locksmiths` - Business profiles with PostGIS location
- `locksmith_services` - Services offered with pricing
- `leads` - Quote requests and bookings
- `reviews` - Customer reviews with ratings
- `favorites` - User saved locksmiths

## 💰 Monetization Model

| Tier | Price | Features |
|------|-------|----------|
| Basic | Free | Standard listing, basic profile |
| Premium | $99/mo | Priority placement, peak hour boost |
| Platinum | $199/mo | Top visibility, multi-area targeting |

## 🚀 Deployment

### Supabase Setup (Required)

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema**
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `supabase/schema.sql`
   - Run the SQL to create all tables, functions, and policies

3. **Import locksmith data** (Optional)
   ```bash
   npx tsx scripts/import-data.ts
   ```
   - This geocodes addresses from `extract-data-2026-01-30.json`
   - Takes ~5 minutes (rate limited to 1 req/sec)
   - Run the generated SQL in `scripts/import-locksmiths.sql`

4. **Enable Google OAuth** (Optional)
   - Go to Authentication > Providers > Google
   - Add your Google OAuth credentials
   - Configure redirect URLs

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
     ```
   - Deploy

3. **Configure Supabase redirect URLs**
   - Go to Supabase > Authentication > URL Configuration
   - Add your Vercel URL to allowed redirects:
     - `https://your-domain.vercel.app/auth/callback`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your production URL | Yes |

## 🗺️ OpenStreetMap Integration

This project uses OpenStreetMap (Leaflet) for mapping - **no API key required!**

Features:
- Interactive map view in search results
- Markers with availability status colors
- Click markers to view locksmith popup
- Free and open-source

## 📊 MVP Development Phases

- [x] **Phase 1** - Project setup, design system, core UI components
- [x] **Phase 2** - Home page, search functionality, geolocation
- [x] **Phase 3** - Locksmith profiles, quote request forms
- [x] **Phase 4** - Authentication pages (login/signup)
- [x] **Phase 5** - B2B landing page, pricing tiers
- [x] **Phase 6** - Supabase database integration
- [x] **Phase 7** - OpenStreetMap integration
- [x] **Phase 8** - Security headers, production polish
- [ ] **Phase 9** - Owner dashboard, admin panel
- [ ] **Phase 10** - Payment integration (Stripe)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the Canadian locksmith industry**
