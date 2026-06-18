import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CadenceProvider } from "@/components/CadenceContext";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MobileCta } from "@/components/MobileCta";
import { SocialProofPopups } from "@/components/SocialProofPopups";
import { ContentGuard } from "@/components/ContentGuard";
import { SmoothScroll } from "@/components/SmoothScroll";

// Body text. Hanken Grotesk - a humanist grotesque with warmth and real
// character in the terminals, far from the generic Inter/system default. Highly
// readable for long-form blog copy, and a clean humanist-vs-technical contrast
// against the Archivo display face. Workhorse for all running copy + data labels.
const hanken = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Display face for headlines. Archivo is a technical grotesque with real
// character. Wide, confident, mechanical letterforms that read like a
// precision instrument and pair cleanly with the mono data layer.
const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  // Browser-tab title is just the brand. The richer positioning line lives in
  // the OpenGraph/Twitter titles below (social cards) and in the on-page h1.
  title: "Lockr",
  description:
    "Daily picks across every sport, plus prediction-market plays on Kalshi and Polymarket. Every pick posted live with a timestamp before the event starts. Cancel any time.",
  metadataBase: new URL("https://joinlockr.com"),
  openGraph: {
    title: "Lockr: Where serious bettors get serious edges",
    description:
      "Daily picks across every sport, plus prediction markets. Public track record. Cancel any time.",
    url: "https://joinlockr.com",
    siteName: "Lockr",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lockr: Where serious bettors get serious edges",
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
    <html lang="en" className={`${hanken.variable} ${archivo.variable}`}>
      <body>
        {/* Site-wide JSON-LD: Organization + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
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
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "hello@joinlockr.com",
                  contactType: "customer support",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Lockr",
                url: "https://joinlockr.com",
                description:
                  "Where serious bettors get serious edges. Daily picks across every sport plus prediction-market plays on Kalshi and Polymarket.",
              },
            ]),
          }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <CadenceProvider>
            <Nav />
            <main id="main" className="page">
              {children}
            </main>
            <Footer />
            <MobileCta />
            <SocialProofPopups />
          </CadenceProvider>
        </SmoothScroll>
        {/* Deterrent against casual copying of the picks (not real security). */}
        <ContentGuard />
        {/* Cookie-less pageview analytics; no-ops on localhost. */}
        <Analytics />
      </body>
    </html>
  );
}
