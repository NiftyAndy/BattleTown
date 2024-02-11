import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Battle Town',
  description: 'Rarity Checker for 10ktf Gtags',
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-32x32.png',
    apple: '/favicon/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <Image src="/10ktf.jpg" alt="10ktf" width={125} height={125} />
        </div>
        {children}
      </body>
    </html>
  );
}
