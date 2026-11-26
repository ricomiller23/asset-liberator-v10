import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "ASSET LIBERATOR • 3D Special Situations Distressed Public Carve-Out & Clean Shell Rollup Engine",
  description: "Institutional intelligence and execution engine to identify valuable operating subsidiaries trapped in broken public company vehicles and execute Article 9, 363, or consensual clean shell rollups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/v10-responsive.css" />
      </head>
      <body className="min-h-screen antialiased selection:bg-[#f5d378] selection:text-[#070a10]">
        <Providers>
          {children}
        </Providers>
        <script src="/v10-suite.js" defer></script>
      </body>
    </html>
  );
}
