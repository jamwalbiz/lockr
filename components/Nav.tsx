"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-inner">
        <Link href="/" className="logo" aria-label="Lockr — Home">
          <span className="logo-dot" aria-hidden="true"></span>LOCKR
        </Link>
        <div className="nav-links">
          <Link href="/" className={isHome ? "active" : ""}>
            Picks
          </Link>
          <Link href="/pricing" className={pathname === "/pricing" ? "active" : ""}>
            Pricing
          </Link>
          <Link href="/about" className={pathname === "/about" ? "active" : ""}>
            About
          </Link>
          <Link href={isHome ? "#faq" : "/#faq"}>FAQ</Link>
        </div>
        <div className="nav-cta">
          <button className="btn btn-ghost" type="button">
            Log in
          </button>
          <Link href="/checkout" className="btn btn-primary">
            Join Lockr
          </Link>
        </div>
      </div>
    </nav>
  );
}
