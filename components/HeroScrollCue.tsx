"use client";

import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";

// Persistent "scroll to next section" cue. Fixed to the viewport (not the hero),
// so it follows you down the page and advances to the next section on each
// click. Fades out near the bottom. Desktop only.
//
// The site disables native smooth scroll and drives the real scroll through
// Lenis, so we scroll via lenis.scrollTo() (same as the site's anchor handler),
// falling back to native scrollTo when Lenis is off (reduced motion).
export function HeroScrollCue() {
  const lenis = useLenis();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      setHidden(window.scrollY + window.innerHeight >= doc.scrollHeight - 240);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function next() {
    const sections = Array.from(document.querySelectorAll("section"));
    const target = sections.find((s) => s.getBoundingClientRect().top > 72);
    const y = target
      ? target.getBoundingClientRect().top + window.scrollY - 80
      : document.documentElement.scrollHeight;
    if (lenis) lenis.scrollTo(y, { duration: 1.0 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      className={`hero-scroll-cue${hidden ? " is-hidden" : ""}`}
      aria-label="Scroll to the next section"
      onClick={next}
    >
      <span className="hero-scroll-chevron" aria-hidden="true" />
    </button>
  );
}
