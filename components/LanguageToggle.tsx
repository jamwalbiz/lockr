"use client";

import { useEffect, useRef, useState } from "react";
import { LANGUAGES } from "@/lib/copy";

export function LanguageToggle() {
  const [current, setCurrent] = useState("EN");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="lang-toggle" ref={rootRef}>
      <button
        className="lang-btn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label="Change language"
        aria-expanded={open}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 010 18" />
          <path d="M12 3a14 14 0 000 18" />
        </svg>
        <span>{current}</span>
      </button>
      <div className={`lang-menu ${open ? "open" : ""}`}>
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            className={`lang-option ${current === l.code ? "active" : ""}`}
            onClick={() => {
              setCurrent(l.code);
              setOpen(false);
            }}
          >
            <span>{l.name}</span>
            <span className="lang-flag">{l.code}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
