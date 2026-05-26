import type { Metadata } from "next";
import { ApplyForm } from "./ApplyForm";

export const metadata: Metadata = {
  title: "Inner Circle Application — Lockr",
  description:
    "Apply for Lockr Inner Circle. 200-member cap. JT personally reviews every application. Average response 48 hours.",
  robots: { index: false, follow: false },
};

export default function ApplyPage() {
  return (
    <div className="shell">
      <div className="apply-page">
        <div className="apply-intro">
          <div className="badge">
            <span className="badge-dot"></span>★ INNER CIRCLE · 33 SPOTS OPEN
          </div>
          <h1>Apply for Inner Circle.</h1>
          <p>
            Inner Circle is capped at 200 active members. JT personally reviews every
            application. Tell us a bit about how you bet today and what you want from the
            top tier — most decisions come back within 48 hours.
          </p>
        </div>
        <ApplyForm />
      </div>
    </div>
  );
}
