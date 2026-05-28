"use client";

import { useEffect } from "react";

// Render-less component: mounts an IntersectionObserver that adds the
// `in-view` class to any `.fade-in-section` element once it scrolls
// into view. Each element is unobserved after triggering so the
// reveal doesn't repeat on scroll-up.
//
// Drop this once into the page tree (e.g. the home page), then mark
// sections with className="fade-in-section". Respects
// prefers-reduced-motion via CSS (sections render visible immediately).
export function FadeInObserver() {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in-section");
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -60px 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
