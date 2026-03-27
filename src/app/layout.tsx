import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#6e42ff',
};

export const metadata: Metadata = {
  title: {
    default: 'ScholarlyEcho — Youth Empowerment Ecosystem',
    template: '%s | ScholarlyEcho',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/logo-black.png',
  },
  description:
    'ScholarlyEcho equips young learners with practical skills, inspires through authentic stories, and engages through educational entertainment. Learn · Inspire · Engage.',
  keywords: ['youth education', 'coding for kids', 'Nigeria', 'edutainment', 'scholarships', 'learning hub'],
  openGraph: {
    title: 'ScholarlyEcho — Youth Empowerment Ecosystem',
    description: 'Empowering youths with tools, exposure, and opportunities to move from confusion to clarity — and personal success to community development.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ScholarlyEcho',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScholarlyEcho',
    description: 'Youth empowerment through learning, inspiration, and engagement.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
