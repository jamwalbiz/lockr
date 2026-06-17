"use client";

import { useEffect } from "react";

// Deterrence-only content guard. Blocks right-click, copy/cut, drag, and text
// selection across the site so the picks (the paid product) aren't trivially
// lifted. This is NOT real security — devtools, view-source, disabling JS, and
// screenshots all bypass it. It only raises the floor against casual copying.
//
// Anything inside a form field (or explicitly marked [data-allow-select]) stays
// fully usable, so the apply form and any text entry keep working. The Whop
// checkout is a cross-origin iframe, so these document-level handlers never
// reach it — card entry / paste there is unaffected.
function isAllowed(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || typeof el.closest !== "function") return false;
  return Boolean(
    el.closest('input, textarea, select, [contenteditable="true"], [data-allow-select]')
  );
}

export function ContentGuard() {
  useEffect(() => {
    const block = (e: Event) => {
      if (isAllowed(e.target)) return;
      e.preventDefault();
    };
    const events = ["contextmenu", "copy", "cut", "dragstart", "selectstart"] as const;
    events.forEach((ev) => document.addEventListener(ev, block));
    return () => events.forEach((ev) => document.removeEventListener(ev, block));
  }, []);

  return null;
}
