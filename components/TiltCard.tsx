"use client";

import { useRef, type ReactNode } from "react";

// Mouse-tilt card effect, Apple / Stripe pattern. Tracks cursor position
// over the card and tilts the element accordingly. Auto-disabled on
// hover-incapable devices and reduced-motion preferences via CSS.
export function TiltCard({
  children,
  className = "",
  maxTilt = 6,
  scale = 1.012,
  perspective = 900,
  title,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(${perspective}px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) scale(${scale})`;
    // Also expose the raw cursor position for the spotlight-glow effect (CSS).
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      title={title}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
