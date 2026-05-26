"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/faq";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className={`faq-item ${isOpen ? "open" : ""}`}>
            <button
              type="button"
              className="faq-q"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
            >
              <span>{item.q}</span>
              <span className="faq-q-icon" aria-hidden="true">
                +
              </span>
            </button>
            <div className="faq-a" id={`faq-answer-${i}`} role="region">
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
