import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://bengaluru-bluff.kirikminchu.chatgpt.site'),
  title: 'Bengaluru Bluff — The Karnataka Detour',
  description: 'Cross Karnataka in one impossible night through ten story stops, three arcade games, snacks, chaos, and a tiny bit of Kannada.',
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Bengaluru Bluff — The Karnataka Detour',
    description: 'One state. Ten stops. Questionable choices.',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Bengaluru Bluff Karnataka road adventure' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bengaluru Bluff — The Karnataka Detour',
    description: 'One state. Ten stops. Questionable choices.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
