import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Roça Digital — Painel do Dono',
  description: 'Painel de gestão da fazenda',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Roça Digital' },
};

export const viewport: Viewport = {
  themeColor: '#0f0c08',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full" style={{ background: '#0f0c08', color: '#f0e6cc' }}>
        {children}
      </body>
    </html>
  );
}
