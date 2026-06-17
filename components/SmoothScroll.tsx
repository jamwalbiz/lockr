"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

// Weighted smooth scroll (Lenis), the "award feel" foundation. Root mode drives
// the real document scroll, so native scroll listeners (Nav, ScrollProgress) and
// the IntersectionObserver reveals keep working unchanged.
//
// Deliberately DISABLED in two cases:
//  - prefers-reduced-motion: render plain children, no smoothing.
//  - /checkout: the Whop payment iframe should own its own scroll/pointer; we
//    don't want Lenis intercepting wheel events over it.

// Intercepts same-page anchor clicks and hands them to Lenis so jumps glide
// instead of snapping. Cross-page links ("/#method") are left to the router.
function AnchorScroll() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as
        | HTMLAnchorElement
        | null;
      const href = a?.getAttribute("href");
      if (!href) return;
      // Smooth-scroll same-page hash links: "#faq" (nav) and "/#faq" (footer),
      // but only when we're already on that page. Everything else navigates.
      let hash = "";
      if (href.startsWith("#")) hash = href;
      else if (href.startsWith("/#") && window.location.pathname === "/")
        hash = href.slice(1);
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash) as HTMLElement | null;
      if (!target) return;
      e.preventDefault();
      // Compute an exact Y (deterministic) rather than passing the element +
      // offset, which Lenis skews when the target has scroll-margin.
      const y = target.getBoundingClientRect().top + window.scrollY - 96;
      lenis.scrollTo(y, { duration: 1.1 });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reduced || pathname?.startsWith("/checkout")) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <AnchorScroll />
      {children}
    </ReactLenis>
  );
}
