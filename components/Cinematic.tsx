"use client";

import { useLenis } from "lenis/react";
import { useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Cinematic scroll layer (GSAP ScrollTrigger). Home page only, so GSAP stays
// out of the checkout/legal bundles. Everything is JS-fail-safe (gsap.fromTo /
// gsap.from leave elements in their natural visible state if scripts never run)
// and fully disabled under prefers-reduced-motion.
export function Cinematic() {
  const lenis = useLenis();

  // Drive ScrollTrigger from Lenis' smooth scroll so scrubs/triggers stay synced.
  useEffect(() => {
    if (!lenis) return;
    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
    ScrollTrigger.refresh();
    return () => lenis.off("scroll", update);
  }, [lenis]);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 1. Monumental section titles wipe up (mask reveal) as they enter. Skip
    //    #method, which already owns a bespoke sequential cascade.
    gsap.utils
      .toArray<HTMLElement>(".section-title")
      .filter((t) => !t.closest("#method"))
      .forEach((t) => {
        gsap.fromTo(
          t,
          { clipPath: "inset(0 0 100% 0)", yPercent: 18 },
          {
            clipPath: "inset(0 0 0% 0)",
            yPercent: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: { trigger: t, start: "top 88%", once: true },
          },
        );
      });

    // 2. Hero depth: drift the DECORATIVE background layers as you scroll out of
    //    the hero (never the text/cards — parallax on content causes sickness).
    gsap.to(".hero-glow", {
      yPercent: 28,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero-grid", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    // 3. Footer wordmark rises gently as the footer enters.
    if (document.querySelector(".footer-wordmark")) {
      gsap.from(".footer-wordmark", {
        yPercent: 16,
        ease: "none",
        scrollTrigger: {
          trigger: ".footer-wordmark",
          start: "top bottom",
          end: "center bottom",
          scrub: true,
        },
      });
    }
  });

  return null;
}
