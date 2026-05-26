import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ActivityTicker } from "@/components/ActivityTicker";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MobileCta } from "@/components/MobileCta";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SocialProofPopups } from "@/components/SocialProofPopups";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lockr — Where serious bettors get serious edges",
  description:
    "Daily picks across every sport, plus prediction-market plays on Kalshi and Polymarket. Every pick posted live with a timestamp before the event starts. Cancel any time.",
  metadataBase: new URL("https://joinlockr.com"),
  openGraph: {
    title: "Lockr — Where serious bettors get serious edges",
    description:
      "Daily picks across every sport, plus prediction markets. Public track record. Cancel any time.",
    url: "https://joinlockr.com",
    siteName: "Lockr",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lockr — Where serious bettors get serious edges",
    description: "Daily picks across every sport, plus prediction markets.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        {/* Organization JSON-LD — applies site-wide */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Lockr",
              url: "https://joinlockr.com",
              logo: "https://joinlockr.com/apple-icon",
              description:
                "Premium subscription sports betting and prediction-market picks. Founded by Jairo Tovar.",
              founder: { "@type": "Person", name: "Jairo Tovar" },
              sameAs: [
                "https://x.com/joinlockr",
                "https://www.tiktok.com/@joinlockr",
                "https://www.instagram.com/joinlockr",
                "https://www.youtube.com/@joinlockr",
              ],
            }),
          }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ActivityTicker />
        <Nav />
        <main id="main" className="page">
          {children}
        </main>
        <Footer />
        <MobileCta />
        <LanguageToggle />
        <SocialProofPopups />
      </body>
    </html>
  );
}
