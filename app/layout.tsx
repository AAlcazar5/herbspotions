import React from 'react';
import { headers } from 'next/headers';
import type { Viewport, Metadata } from 'next';
import { CartProvider } from '@/shared/context/StoreContext';
import Nav from '@/shared/components/Nav';
import Footer from '@/shared/components/Footer';
import { ThemeProvider } from '@/shared/components/ThemeProvider';
import "./globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css';
import FontAwesomeConfigLoader from '@/shared/components/FontawesomeConfig.client';
import AgeGateModal from '@/shared/components/AgeGateModal';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: 'Home Page | Herbs & Potions',
  description: 'The homepage, where we have the hero, some featured CBD products, and a description of what our company is about.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = headers().get('x-nonce') || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
         <FontAwesomeConfigLoader />
      </head>
      <body className={`antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            nonce={nonce}
          >
            <CartProvider>
              <div className="flex flex-col justify-between min-h-screen">
                <Nav nonce={nonce} />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </ThemeProvider>
          <AgeGateModal />
      </body>
    </html>
  );
}