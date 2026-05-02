import type { Metadata, Viewport } from 'next';
import './globals.css';
import LayoutShell from '@/components/LayoutShell';
import { ToastProvider } from '@/components/Toast';
import { ConfirmProvider } from '@/components/ConfirmDialog';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#6e42ff',
};

export const metadata: Metadata = {
  title: {
    default: 'ScholarlyEcho: Youth Empowerment Ecosystem',
    template: '%s | ScholarlyEcho',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/logo-black.png',
  },
  description:
    'ScholarlyEcho equips young learners with practical skills, inspires through authentic stories, and engages through educational entertainment. Trusted by homeschooling families worldwide for cognitive development and 21st-century skills. Learn · Inspire · Engage.',
  keywords: ['youth education', 'coding for kids', 'homeschooling', 'homeschool curriculum', 'homeschool families', 'brain development', 'cognitive development', 'Nigeria', 'edutainment', 'scholarships', 'learning hub'],
  openGraph: {
    title: 'ScholarlyEcho: Youth Empowerment Ecosystem',
    description: 'Empowering youths with tools, exposure, and opportunities to move from confusion to clarity, and from personal success to community development.',
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
        <ToastProvider>
          <ConfirmProvider>
            <LayoutShell>{children}</LayoutShell>
          </ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
