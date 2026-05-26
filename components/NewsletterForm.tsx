"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <form
      className="footer-capture-form"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire to Beehiiv API in Phase 1 of launch checklist
        setSubscribed(true);
      }}
    >
      <input
        type="email"
        placeholder="you@example.com"
        required
        aria-label="Email address"
      />
      <button type="submit" disabled={subscribed}>
        {subscribed ? "✓ Subscribed" : "Subscribe"}
      </button>
    </form>
  );
}
