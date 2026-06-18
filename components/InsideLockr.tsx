import Link from "next/link";

// "Inside Lockr" — the daily membership experience. The centerpiece is a live,
// auto-scrolling "#the-room" feed (Lockr drops the play, members tail / post
// results / react), each message with its own avatar, beside the actual slip
// card and the live markets board. On-brand (dark + green, plain English, no
// hype, no fabricated dollar claims). Motion is a transform-only vertical
// marquee that pauses on hover and goes still under prefers-reduced-motion.

type Msg = {
  lockr?: boolean;
  creator?: boolean;
  name: string;
  av?: string;
  init?: string;
  time: string;
  tag?: string;
  tagClass?: string;
  text: string;
};

const ROOM: Msg[] = [
  { lockr: true, name: "Lockr", time: "6:54p", tag: "PLAY", tagClass: "play", text: "NBA · Brunson Over 26.5 · 2u · posted before the line moved" },
  { name: "marcus_t", av: "c1", init: "M", time: "6:55p", tag: "tailed", tagClass: "ok", text: "in at -110, book moved it to -130 by the time I refreshed. that's the edge 🎯" },
  { name: "dani", av: "c2", init: "D", time: "6:56p", text: "+3.4u on the week and I can finally explain every one of them 📈" },
  { lockr: true, name: "Lockr", time: "7:12p", tag: "PLAY", tagClass: "play", text: "Kalshi · Rate decision · Yes 58¢ · 1u" },
  { name: "kev", av: "c3", init: "K", time: "7:13p", text: "first prediction-market trade ever just settled green 📊 didn't even feel like gambling" },
  { name: "ro", av: "c4", init: "R", time: "earlier", tag: "+1.6u", tagClass: "win", text: "that UFC KO from last night cashed. 4 of 5 this week 🥊" },
  { name: "amara", av: "c5", init: "A", time: "earlier", text: "pulled my first cashout today. small, but it's real money in my account 💸" },
  { creator: true, name: "JT", av: "c2", init: "JT", time: "earlier", text: "the play that missed Tuesday is still pinned up top with the full breakdown 📌 nothing gets deleted here" },
  { name: "sam", av: "c3", init: "S", time: "earlier", text: "month one done, up steady and not stressed. the unit sizing kept me out of trouble ✅" },
];

const MOVERS = [
  { src: "Polymarket", q: "Fed cuts rates in July", pct: "31%", dir: "down" as const, d: "−6" },
  { src: "Kalshi", q: "Knicks win the East", pct: "44%", dir: "up" as const, d: "+3" },
  { src: "Polymarket", q: "GTA 6 ships in 2026", pct: "62%", dir: "up" as const, d: "+5" },
  { src: "Kalshi", q: "Jobs report beats forecast", pct: "38%", dir: "down" as const, d: "−4" },
  { src: "Polymarket", q: "Lakers make the playoffs", pct: "71%", dir: "up" as const, d: "+2" },
];

function Message({ m }: { m: Msg }) {
  return (
    <div className="room-msg">
      {m.lockr ? (
        <span className="room-av room-av-lockr" aria-hidden="true" />
      ) : (
        <span className={`room-av ${m.av}`} aria-hidden="true">
          {m.init}
        </span>
      )}
      <div className="room-body">
        <div className="room-name-row">
          <span className={`room-name${m.lockr ? " lockr" : ""}`}>{m.name}</span>
          {m.lockr && (
            <span className="room-verified" aria-hidden="true">
              ✓
            </span>
          )}
          {m.creator && <span className="room-creator">CREATOR</span>}
          <span className="room-time">{m.time}</span>
          {m.tag && <span className={`room-tag ${m.tagClass ?? ""}`}>{m.tag}</span>}
        </div>
        <div className="room-text">{m.text}</div>
      </div>
    </div>
  );
}

export function InsideLockr() {
  return (
    <section className="fade-in-section inside">
      <div className="shell">
        <div className="section-head">
          <div className="section-label">Inside Lockr</div>
          <h2 className="section-title">
            See exactly how
            <br />a play reaches you.
          </h2>
          <p className="section-sub">
            Every day, the plays drop in the members Discord, posted before the line
            moves. The room copies them, posts the wins and the losses, and JT breaks
            down the misses too. You just tail it.
          </p>
        </div>

        <div className="inside-grid">
          {/* The live room feed */}
          <div className="inside-feed">
            <div className="inside-feed-head">
              <span className="inside-feed-mark" aria-hidden="true" />
              <span className="inside-feed-server">Lockr</span>
              <span className="inside-feed-sep" aria-hidden="true">/</span>
              <span className="inside-hash">#</span>
              <span className="inside-channel">the-room</span>
              <span className="inside-live" aria-label="Live channel">
                <span className="inside-live-dot" aria-hidden="true" />
                live
              </span>
            </div>
            <div className="room-stream">
              <div className="room-track">
                {[...ROOM, ...ROOM].map((m, i) => (
                  <Message key={i} m={m} />
                ))}
              </div>
            </div>
            <div className="inside-input">
              <span className="inside-input-text">Message #the-room</span>
              <span className="inside-input-send" aria-hidden="true">↵</span>
            </div>
          </div>

          {/* Side column: the card + live markets */}
          <div className="inside-side">
            <div className="inside-card">
              <div className="inside-card-tag">// the card that drops</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/inside-slip.png"
                alt="The Lockr play card that drops with every pick"
                className="inside-slip"
              />
            </div>

            <div className="inside-card">
              <div className="inside-card-tag">// live markets</div>
              <p className="inside-card-sub">
                Kalshi and Polymarket, the prediction markets we read right next to the
                books.
              </p>
              <div className="inside-movers">
                {MOVERS.map((m) => (
                  <div key={m.q} className="inside-mover">
                    <div className="inside-mover-q">
                      <span className="inside-mover-src">{m.src}</span>
                      <span className="inside-mover-name">{m.q}</span>
                    </div>
                    <div className="inside-mover-pct">
                      {m.pct}
                      <span className={`inside-delta ${m.dir}`}>{m.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="inside-cta">
          <Link href="/checkout" className="btn btn-primary btn-lg">
            Get today&apos;s plays
          </Link>
          <span className="inside-cta-sub">From $29/wk · cancel any time</span>
        </div>
      </div>
    </section>
  );
}
