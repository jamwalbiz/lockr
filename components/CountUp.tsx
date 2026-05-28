"use client";

import { useEffect, useRef, useState } from "react";

// Counts from 0 → `to` on viewport entry, once. Renders the final value on
// the server + before mount, so there's no flash-of-zero for SEO or users
// with reduced-motion preferences. Animation only kicks in for motion-friendly
// clients once the element actually scrolls into view.
export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1400,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(to);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf: number | null = null;
    let cleared = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || cleared) return;
          cleared = true;
          observer.disconnect();
          const startedAt = performance.now();
          setValue(0);
          const tick = (now: number) => {
            const t = Math.min((now - startedAt) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(to * eased);
            if (t < 1) raf = requestAnimationFrame(tick);
            else setValue(to);
          };
          raf = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
