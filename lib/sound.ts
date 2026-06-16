// Brief click/confirmation chimes synthesized via Web Audio API.
// No audio assets; tones generated in-browser, low volume by default.
// All effects respect prefers-reduced-motion and degrade silently if
// the browser doesn't support Web Audio (older mobile, etc.).
//
// Design notes: matching the bright bell-like character of premium
// onboarding chimes (Whop "create a business", Apple Pay success).
// Key ingredients of that sound:
//   1. Triangle wave fundamental + sine harmonic an octave up (3:1
//      amplitude). Pure sines feel hollow; sawtooth/square feel harsh.
//      Triangle + harmonic = the "bell" character.
//   2. Quick upward pitch bend on attack (~3% over 12ms). That's the
//      "ping" feel, vs. the dry "click" of a descending sweep.
//   3. Lowpass at ~3kHz softens any high-frequency edge.
//   4. Exponential decay (not linear). Real bells decay exponentially.
//   5. Single bright note per CTA, ascending triad for success.

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

/**
 * One bell-like note: triangle fundamental + sine harmonic an octave up,
 * with a quick upward pitch bend on attack and exponential decay.
 * Shared by playClick (one note) and playSuccess (three stacked notes).
 */
function playBell(
  ctx: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  volume: number,
) {
  const t = ctx.currentTime + startOffset;

  // Per-note master gain envelope: exponential decay = real bell character.
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(volume, t + 0.005); // 5ms attack
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  // Lowpass softens high-frequency edge so the chime feels warm, not piercing.
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 3200;
  filter.Q.value = 0.7;

  env.connect(filter);
  filter.connect(ctx.destination);

  // Voice 1: triangle fundamental with upward pitch bend on attack.
  const fund = ctx.createOscillator();
  fund.type = "triangle";
  fund.frequency.setValueAtTime(freq * 0.97, t);
  fund.frequency.exponentialRampToValueAtTime(freq, t + 0.012);
  fund.connect(env);
  fund.start(t);
  fund.stop(t + duration + 0.02);

  // Voice 2: sine harmonic one octave up, ~1/3 amplitude (a separate gain
  // before the envelope so it sits under the fundamental).
  const harmGain = ctx.createGain();
  harmGain.gain.value = 0.32;
  const harm = ctx.createOscillator();
  harm.type = "sine";
  harm.frequency.setValueAtTime(freq * 2 * 0.97, t);
  harm.frequency.exponentialRampToValueAtTime(freq * 2, t + 0.012);
  harm.connect(harmGain);
  harmGain.connect(env);
  harm.start(t);
  harm.stop(t + duration + 0.02);
}

/** Bright bell-like ping for primary CTAs (~280ms). A5 fundamental + A6 harmonic. */
function playClick(volume = 0.07) {
  const ctx = getCtx();
  if (!ctx) return;
  playBell(ctx, 880, 0, 0.28, volume); // A5
}

/** Three-note ascending major triad for completion moments (~520ms).
 *  C5 → E5 → G5, each bell-like with overlap. */
function playSuccess(volume = 0.06) {
  const ctx = getCtx();
  if (!ctx) return;
  playBell(ctx, 523.25, 0.0, 0.32, volume); // C5
  playBell(ctx, 659.25, 0.085, 0.34, volume); // E5
  playBell(ctx, 783.99, 0.18, 0.42, volume * 1.05); // G5 (slightly louder; it's the "landing")
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
 * Combined feedback for primary CTAs. Plays a brief bell-like chime + light haptic.
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
 * checkout finished). Three-note ascending triad + stronger haptic pattern.
 */
export function feedbackSuccess() {
  if (reducedMotion()) {
    haptic(15);
    return;
  }
  playSuccess();
  haptic([10, 30, 10]);
}
