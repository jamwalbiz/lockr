"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { feedbackClick } from "@/lib/sound";
import { Magnetic } from "@/components/Magnetic";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Translucent → opaque past 12px scroll
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on Escape, route change, or click outside.
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    // Lock body scroll while menu is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`} aria-label="Primary">
        <div className="nav-inner">
          <Link href="/" className="logo" aria-label="Lockr, Home">
            <span className="logo-dot" aria-hidden="true"></span>LOCKR
          </Link>
          <div className="nav-links">
            <Link href="/" className={isHome ? "active" : ""}>
              Picks
            </Link>
            <Link href="/markets">Markets</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div className="nav-cta">
            <a
              href="https://whop.com/orders"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost nav-login"
            >
              Log in
            </a>
            <Magnetic strength={0.4}>
              <Link
                href="/checkout"
                className="btn btn-primary nav-join"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                onClick={() => {
                  feedbackClick();
                  track("cta_click", { cta: "join", location: "nav" });
                }}
              >
                Join Lockr
              </Link>
            </Magnetic>
            <button
              type="button"
              className="nav-hamburger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => {
                setMenuOpen((o) => {
                  if (!o) track("mobile_menu_open");
                  return !o;
                });
              }}
            >
              <span aria-hidden="true" className={`burger ${menuOpen ? "open" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-down menu: display:none on desktop via CSS */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        hidden={!menuOpen}
      >
        <div className="mobile-menu-inner">
          <Link href="/" className="mobile-link" onClick={closeMenu}>
            Picks
          </Link>
          <Link href="/markets" className="mobile-link" onClick={closeMenu}>
            Markets
          </Link>
          <Link href="/blog" className="mobile-link" onClick={closeMenu}>
            Blog
          </Link>
          <Link
            href="/checkout?tier=innercircle&cadence=monthly"
            className="mobile-link"
            onClick={closeMenu}
          >
            Apply for Inner Circle
          </Link>
          <div className="mobile-menu-cta">
            <a
              href="https://whop.com/orders"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={closeMenu}
            >
              Log in
            </a>
            <Link
              href="/checkout"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => {
                feedbackClick();
                track("cta_click", { cta: "join", location: "mobile_menu" });
                closeMenu();
              }}
            >
              Join Lockr →
            </Link>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
