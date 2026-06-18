"use client";

// Small "scroll down" cue at the foot of the hero. Now that the nav no longer
// offers in-page jumps, this nudges cold traffic into the linear scroll toward
// the offer. Desktop only (the mobile hero is tight and scrolling is natural) —
// hidden via CSS on small screens.
export function HeroScrollCue() {
  return (
    <button
      type="button"
      className="hero-scroll-cue"
      aria-label="Scroll to the next section"
      onClick={() => {
        const hero = document.querySelector(".hero");
        const next = hero?.nextElementSibling as HTMLElement | null;
        next?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      <span className="hero-scroll-chevron" aria-hidden="true" />
    </button>
  );
}
