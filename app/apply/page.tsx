import type { Metadata } from "next";
import { ApplyForm } from "./ApplyForm";
import { BreadcrumbsLd } from "@/components/BreadcrumbsLd";

export const metadata: Metadata = {
  title: "Inner Circle Application — Lockr",
  description:
    "Apply for Lockr Inner Circle. 200-member cap. Tell us how you bet so JT can deliver from day one.",
  robots: { index: false, follow: false },
};

export default function ApplyPage() {
  return (
    <div className="shell">
      <BreadcrumbsLd
        trail={[
          { name: "Home", url: "https://joinlockr.com/" },
          { name: "Inner Circle Application", url: "https://joinlockr.com/apply" },
        ]}
      />
      <div className="apply-page">
        <div className="apply-intro">
          <div className="badge">
            <span className="badge-dot"></span>★ INNER CIRCLE · 33 SPOTS OPEN
          </div>
          <h1>Apply for Inner Circle.</h1>
          <p>
            Inner Circle is capped at 200 active members. Tell us how you bet today and
            what you want from the top tier — so JT knows what to deliver when you join.
          </p>
        </div>
        <ApplyForm />
      </div>
    </div>
  );
}
