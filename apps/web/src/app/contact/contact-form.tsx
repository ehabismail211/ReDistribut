"use client";

import { FormEvent, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [renderedAt] = useState(() => new Date().toISOString());
  const safeIntent = useMemo(() => intentLabels[initialIntent] ? initialIntent : "pilot", [initialIntent]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      organization: String(formData.get("organization") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      role: String(formData.get("role") ?? ""),
      city: String(formData.get("city") ?? ""),
      inquiryType: String(formData.get("intent") ?? safeIntent),
      organizationType: String(formData.get("organizationType") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
      message: String(formData.get("message") ?? ""),
      consent: formData.get("consent") === "on",
      website: String(formData.get("website") ?? ""),
      renderedAt,
    };

    try {
      const response = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: { message?: string } } | null;
        throw new Error(result?.error?.message ?? "Inquiry could not be submitted.");
      }

      setSubmitted(true);
      form.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Inquiry could not be submitted.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mkt-form-success" role="status">
        <CheckCircle2 size={32} aria-hidden />
        <h2>Inquiry sent to founder review.</h2>
        <p>
          Your inquiry has been captured as a ReDist lead record. The founder will review pilot fit before any
          workspace access is shared.
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
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+971..." />
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
      <label className="mkt-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {error ? (
        <p className="mkt-form-error" role="alert">
          <AlertCircle size={18} aria-hidden />
          {error}
        </p>
      ) : null}
      <button className="mkt-button mkt-button-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit inquiry"}
      </button>
    </form>
  );
}
