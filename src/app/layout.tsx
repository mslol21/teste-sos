import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';

export const metadata: Metadata = {
  title: 'S.O.S. Lanches & Beer Londrina | Cardápio Digital & Delivery Online',
  description: 'Sistema de delivery oficial do S.O.S. Lanches & Beer em Londrina. Dogs especiais, lanches prensados, burguers na brasa, porções crocantes e cervejas trincando!',
  keywords: ['sos lanches', 'sos lanches londrina', 'delivery', 'dogs', 'prensados', 'burguers na brasa', 'anota ai', 'pedidos online'],
  openGraph: {
    title: 'S.O.S. Lanches & Beer — O Verdadeiro S.O.S. da sua Fome em Londrina!',
    description: 'Faça seu pedido online no S.O.S. Lanches com entrega ultra rápida em Londrina e Região Norte.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'S.O.S. Lanches & Beer',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'S.O.S. Lanches & Beer Londrina',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S.O.S. Lanches & Beer Londrina',
    description: 'O verdadeiro S.O.S. da sua fome em Londrina com entrega super rápida.',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased selection:bg-red-500 selection:text-white">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
