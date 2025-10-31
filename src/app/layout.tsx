
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Roboto, Poppins, Fira_Code } from 'next/font/google';
import { SocialLinks } from '@/components/social-links';
import { FirebaseClientProvider } from '@/firebase';
import { Particles } from '@/components/particles';

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-poppins',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-fira-code',
});

export const metadata: Metadata = {
  title: 'ICMSTRY - IC 2024',
  description: 'IC 2024 Manajemen Informatika Politeknik Negeri Sriwijaya.',
  icons: {
    icon: '/images/icon/logo-icV2.ico?v=7',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${roboto.variable} ${poppins.variable} ${firaCode.variable} font-body antialiased`}>
        <FirebaseClientProvider>
          <Particles className="fixed inset-0 -z-10 animate-fade-in" quantity={100} />
          <div className="fixed inset-0 -z-20 animated-gradient-bg" />
          <SocialLinks />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
