"use client";

import { useState } from "react";
import { leadStatusLabels, leadStatuses, type LeadStatus } from "@/lib/leads";

export function LeadStatusActions({ leadId, currentStatus }: { leadId: string; currentStatus: LeadStatus }) {
  const [status, setStatus] = useState<LeadStatus>(currentStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function updateStatus(nextStatus: LeadStatus) {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/v1/leads/${leadId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: { message?: string } } | null;
        throw new Error(result?.error?.message ?? "Lead status could not be updated.");
      }

      setStatus(nextStatus);
      setMessage(`Moved to ${leadStatusLabels[nextStatus].toLowerCase()}.`);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Lead status could not be updated.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="lead-status-actions">
      <label>
        <span>Lead status</span>
        <select
          value={status}
          disabled={isSaving}
          onChange={(event) => updateStatus(event.target.value as LeadStatus)}
        >
          {leadStatuses.map((value) => (
            <option value={value} key={value}>{leadStatusLabels[value]}</option>
          ))}
        </select>
      </label>
      {message ? <small>{message}</small> : null}
    </div>
  );
}
