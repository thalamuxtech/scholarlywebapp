'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollToTop from '@/components/ScrollToTop';
import SummerFlyerPopup from '@/components/SummerFlyerPopup';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isSummerPage = pathname.startsWith('/summer-coding-2026');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <ScrollToTop />
      {!isSummerPage && <SummerFlyerPopup />}
    </>
  );
}
