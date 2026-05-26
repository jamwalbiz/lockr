"use client";

import { useEffect, useState } from "react";
import { SOCIAL_PROOF } from "@/lib/copy";

type Active = {
  id: number;
  msg: (typeof SOCIAL_PROOF)[number];
  visible: boolean;
};

export function SocialProofPopups() {
  const [active, setActive] = useState<Active[]>([]);

  useEffect(() => {
    let index = 0;
    let nextId = 0;

    function push() {
      const msg = SOCIAL_PROOF[index];
      index = (index + 1) % SOCIAL_PROOF.length;
      const id = ++nextId;
      setActive((curr) => [...curr, { id, msg, visible: false }]);
      // animate in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setActive((curr) => curr.map((a) => (a.id === id ? { ...a, visible: true } : a)));
        });
      });
      // animate out at 6.5s, remove at 7s
      window.setTimeout(() => {
        setActive((curr) => curr.map((a) => (a.id === id ? { ...a, visible: false } : a)));
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
