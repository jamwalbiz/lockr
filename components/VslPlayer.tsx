"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Self-hosted motion-graphic VSL (rendered with Remotion -> /public/lockr-vsl.mp4).
 * Plays once, muted, when scrolled into view; native controls satisfy WCAG 2.2.2
 * (a pause mechanism for moving content > 5s). It ends on the CTA end-card rather
 * than looping. A click anywhere unmutes + restarts for sound-on viewing once a
 * voiceover track is baked in.
 */
export default function VslPlayer() {
  const ref = useRef<HTMLVideoElement>(null);
  const played = useRef(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // honor reduced motion: leave on poster, controls still work

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !played.current) {
            played.current = true;
            el.play().catch(() => {});
          }
        }
      },
      { threshold: 0.55 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onClick = () => {
    const el = ref.current;
    if (!el) return;
    if (muted) {
      el.muted = false;
      el.currentTime = 0;
      setMuted(false);
      el.play().catch(() => {});
    }
  };

  return (
    <div className="vsl-player vsl-native" onClick={onClick} style={{ cursor: muted ? "pointer" : "default" }}>
      <video
        ref={ref}
        className="vsl-video"
        poster="/brand/lockr-vsl-poster.png"
        muted={muted}
        playsInline
        controls
        preload="metadata"
      >
        <source src="/lockr-vsl.mp4" type="video/mp4" />
      </video>
      {muted && (
        <div className="vsl-sound-hint" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12z" />
          </svg>
          Tap for sound
        </div>
      )}
    </div>
  );
}
