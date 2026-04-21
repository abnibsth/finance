import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Quest - Track Your Daily Financial Journey",
  description: "A gaming-themed personal finance tracker for managing your daily expenses and income",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Ad Scripts */}
        <Script src="https://pl29213586.profitablecpmratenetwork.com/6d/9b/fa/6d9bfa436bd5f71cd4026a6da3e3439f.js" strategy="lazyOnload" />
        <Script src="https://pl29213587.profitablecpmratenetwork.com/fa9f8bf0ea36a4796514b86c6f0f5fe2/invoke.js" strategy="lazyOnload" />
        <Script src="https://pl29213589.profitablecpmratenetwork.com/fb/08/0c/fb080c513d25b3cca956d2b0dda2d17d.js" strategy="lazyOnload" />
        
        {/* Ad configuration for highperformanceformat */}
        <Script id="at-options" strategy="lazyOnload">
          {`
            atOptions = {
              'key' : 'c5192cb318a481a390982c0fe68c171e',
              'format' : 'iframe',
              'height' : 300,
              'width' : 160,
              'params' : {}
            };
          `}
        </Script>
        <Script src="https://www.highperformanceformat.com/c5192cb318a481a390982c0fe68c171e/invoke.js" strategy="lazyOnload" />
        
        {children}
        
        {/* Ad Containers */}
        <div id="container-fa9f8bf0ea36a4796514b86c6f0f5fe2" />
      </body>
    </html>
  );
}
