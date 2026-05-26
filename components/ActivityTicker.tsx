import { ACTIVITY_ITEMS } from "@/lib/copy";

export function ActivityTicker() {
  // Duplicate for seamless CSS marquee loop.
  const items = [...ACTIVITY_ITEMS, ...ACTIVITY_ITEMS];
  return (
    // Decorative — repeating ticker text would be noise for screen readers.
    <div className="activity-bar" aria-hidden="true">
      <div className="activity-live">
        <span className="activity-live-dot"></span>LIVE
      </div>
      <div className="activity-track">
        {items.map((item, i) => (
          <span key={i} className="activity-item">
            <span className={`activity-dot ${item.tone}`}></span>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
