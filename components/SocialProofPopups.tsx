"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { generateSocialProofItems, type SocialProofItem } from "@/lib/copy";

type Active = {
  id: number;
  msg: SocialProofItem;
  visible: boolean;
};

// Routes where the floating social-proof toasts would distract from the
// page's actual task. /checkout has the Whop embed (and its submit button)
// in the bottom-right zone — popups would physically cover it and create
// two competing "join now" signals. The persuasion job is already done
// by the time someone reaches checkout.
const HIDE_ON = ["/checkout"];

export function SocialProofPopups() {
  const pathname = usePathname();
  const [active, setActive] = useState<Active[]>([]);
  const hide = HIDE_ON.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  useEffect(() => {
    // On hidden routes, don't even schedule the loop — saves work and
    // prevents popups from appearing during a brief render flicker.
    if (hide) return;
    // Generate a fresh pool per visit so back-to-back loads show different names.
    const pool = generateSocialProofItems(30);
    let index = 0;
    let nextId = 0;

    function push() {
      const msg = pool[index];
      index = (index + 1) % pool.length;
      const id = ++nextId;
      setActive((curr) => [...curr, { id, msg, visible: false }]);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setActive((curr) =>
            curr.map((a) => (a.id === id ? { ...a, visible: true } : a)),
          );
        });
      });
      window.setTimeout(() => {
        setActive((curr) =>
          curr.map((a) => (a.id === id ? { ...a, visible: false } : a)),
        );
      }, 6500);
      window.setTimeout(() => {
        setActive((curr) => curr.filter((a) => a.id !== id));
      }, 7000);
    }

    const firstTimer = window.setTimeout(push, 4000);
    const interval = window.setInterval(push, 12000);
    return () => {
      window.clearTimeout(firstTimer);
      window.clearInterval(interval);
    };
  }, [hide]);

  function close(id: number) {
    setActive((curr) => curr.map((a) => (a.id === id ? { ...a, visible: false } : a)));
    window.setTimeout(() => {
      setActive((curr) => curr.filter((a) => a.id !== id));
    }, 500);
  }

  if (hide) return null;

  return (
    <div className="social-proof-stack" aria-live="polite">
      {active.map(({ id, msg, visible }) => (
        <div key={id} className={`social-proof ${visible ? "show" : ""}`}>
          <div className={`social-proof-avatar ${msg.tone}`}>{msg.avatar}</div>
          <div className="social-proof-text">
            <div className="social-proof-name">{msg.name}</div>
            <div className="social-proof-detail">{msg.detail}</div>
          </div>
          <button
            type="button"
            className="social-proof-close"
            onClick={() => close(id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
