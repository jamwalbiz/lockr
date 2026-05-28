// Brief click/confirmation sounds synthesized via Web Audio API.
// No audio assets — tones generated in-browser, low volume by default.
// All effects respect prefers-reduced-motion and degrade silently if
// the browser doesn't support Web Audio (older mobile, etc.).

let cachedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!cachedCtx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      cachedCtx = new Ctor();
    }
    if (cachedCtx.state === "suspended") {
      cachedCtx.resume();
    }
    return cachedCtx;
  } catch {
    return null;
  }
}

function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Brief 120ms descending click — Apple-style confirmation. */
function playClick(volume = 0.035) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(900, t);
  osc.frequency.exponentialRampToValueAtTime(450, t + 0.09);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.13);
}

/** Two-tone ascending arpeggio for completion moments (~280ms). */
function playSuccess(volume = 0.04) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const notes = [
    { freq: 523.25, start: 0, dur: 0.12 }, // C5
    { freq: 783.99, start: 0.09, dur: 0.2 }, // G5
  ];
  for (const note of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = note.freq;
    gain.gain.setValueAtTime(volume, t + note.start);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + note.start + note.dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t + note.start);
    osc.stop(t + note.start + note.dur + 0.01);
  }
}

/** Mobile haptic via Web Vibration API (Android Chrome + Firefox; iOS no-ops).
 *  Accepts a duration in ms, or a pattern array (vibrate/pause/vibrate/...). */
function haptic(pattern: number | number[] = 10) {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(pattern);
    } catch {
      // silent
    }
  }
}

/**
 * Combined feedback for primary CTAs. Plays a brief click + light haptic.
 * Honors prefers-reduced-motion (skips audio, still allows tiny haptic).
 */
export function feedbackClick() {
  if (reducedMotion()) {
    haptic(5);
    return;
  }
  playClick();
  haptic(10);
}

/**
 * Combined feedback for completion moments (IC application submitted,
 * checkout finished). Two-tone success + slightly stronger haptic.
 */
export function feedbackSuccess() {
  if (reducedMotion()) {
    haptic(15);
    return;
  }
  playSuccess();
  haptic([10, 30, 10]);
}
