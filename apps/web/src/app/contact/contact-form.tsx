"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const intentLabels: Record<string, string> = {
  pilot: "Pilot interest",
  supplier: "Supplier inquiry",
  recipient: "Recipient inquiry",
  partner: "Partnership request",
  impact: "Impact / ESG discussion",
  demo: "Founder walkthrough",
  question: "General question",
};

export function ContactForm({ initialIntent = "pilot" }: { initialIntent?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const safeIntent = useMemo(() => intentLabels[initialIntent] ? initialIntent : "pilot", [initialIntent]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const lead = Object.fromEntries(formData.entries());
    const existing = JSON.parse(window.localStorage.getItem("redistMarketingLeads") ?? "[]") as unknown[];
    window.localStorage.setItem("redistMarketingLeads", JSON.stringify([...existing, { ...lead, capturedAt: new Date().toISOString() }]));
    setSubmitted(true);
    event.currentTarget.reset();
  }

  if (submitted) {
    return (
      <div className="mkt-form-success" role="status">
        <CheckCircle2 size={32} aria-hidden />
        <h2>Inquiry captured for founder review.</h2>
        <p>
          This MVP form stores the inquiry in this browser for soft-launch testing. Connect the form to the approved
          founder inbox or CRM before public promotion.
        </p>
        <button className="mkt-button mkt-button-primary" type="button" onClick={() => setSubmitted(false)}>Submit another inquiry</button>
      </div>
    );
  }

  return (
    <form className="mkt-contact-form" onSubmit={handleSubmit}>
      <div className="mkt-form-grid">
        <label>
          <span>Full name</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          <span>Work email</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          <span>Organization</span>
          <input name="organization" required autoComplete="organization" />
        </label>
        <label>
          <span>Role / title</span>
          <input name="role" required autoComplete="organization-title" />
        </label>
        <label>
          <span>City / emirate</span>
          <input name="city" required placeholder="Dubai, Abu Dhabi, Sharjah..." />
        </label>
        <label>
          <span>Interest type</span>
          <select name="intent" required defaultValue={safeIntent}>
            {Object.entries(intentLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
        <label>
          <span>Organization type</span>
          <select name="organizationType" required defaultValue="">
            <option value="" disabled>Select one</option>
            <option>Hotel / hospitality</option>
            <option>Restaurant / food service</option>
            <option>Warehouse / logistics</option>
            <option>NGO / charity</option>
            <option>School / training center</option>
            <option>Corporate ESG / sustainability</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          <span>Timeline</span>
          <select name="timeline" defaultValue="2 weeks">
            <option>Immediate</option>
            <option>2 weeks</option>
            <option>1 month</option>
            <option>Later</option>
          </select>
        </label>
      </div>
      <label>
        <span>Resource category, need, or partnership idea</span>
        <textarea name="message" required rows={5} placeholder="Tell us what surplus you have, what resources you need, or how you want to partner." />
      </label>
      <label className="mkt-checkbox">
        <input name="consent" type="checkbox" required />
        <span>I consent to ReDist contacting me about this inquiry. I understand this form should not be used to submit sensitive documents.</span>
      </label>
      <button className="mkt-button mkt-button-primary" type="submit">Submit inquiry</button>
    </form>
  );
}
