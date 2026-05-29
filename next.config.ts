import type { NextConfig } from "next";

// Global security headers applied to every response.
// Conservative — no CSP yet (deliberate; CSP needs a dedicated security pass
// once 3rd-party integrations are wired so we don't whack-a-mole break things).
const securityHeaders = [
  // Force HTTPS for 2 years, including subdomains. Preload-eligible.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Stop the browser from MIME-sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block other sites from iframing us — clickjacking defense.
  { key: "X-Frame-Options", value: "DENY" },
  // Limit referrer info leaked to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful features we don't use. Tighten further when we know what
  // checkout/Discord integrations actually need.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Apple Pay domain verification. The file has no extension so Vercel
      // serves it as application/octet-stream by default, which can confuse
      // Apple's / Whop's verifier. Force text/plain so the response looks
      // right to whatever's fetching it.
      {
        source: "/.well-known/apple-developer-merchantid-domain-association",
        headers: [{ key: "Content-Type", value: "text/plain" }],
      },
    ];
  },
};

export default nextConfig;
