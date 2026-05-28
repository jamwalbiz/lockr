"use client";

import { useEffect, useState } from "react";
import { generateSocialProofItems, type SocialProofItem } from "@/lib/copy";

type Active = {
  id: number;
  msg: SocialProofItem;
  visible: boolean;
};

export function SocialProofPopups() {
  const [active, setActive] = useState<Active[]>([]);

  useEffect(() => {
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
  }, []);

  function close(id: number) {
    setActive((curr) => curr.map((a) => (a.id === id ? { ...a, visible: false } : a)));
    window.setTimeout(() => {
      setActive((curr) => curr.filter((a) => a.id !== id));
    }, 500);
  }

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
