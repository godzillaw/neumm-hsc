import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import CookieBanner from "@/components/legal/CookieBanner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Neumm HSC",
  description: "Neumm HSC — your study companion",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Neumm HSC',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // minimumScale prevents iOS Safari from zooming out accidentally
  minimumScale: 1,
  viewportFit: 'cover',
  // interactiveWidget keeps the viewport stable when the keyboard appears on iPad
  interactiveWidget: 'resizes-content',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <CookieBanner />
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
