"use client";

import { useState } from "react";
import {
  leadStatusLabels,
  leadStatuses,
  meetingStatusLabels,
  meetingStatuses,
  pilotStatusLabels,
  pilotStatuses,
  type LeadStatus,
  type MeetingStatus,
  type PilotStatus,
} from "@/lib/leads";

export function LeadStatusActions({
  leadId,
  currentStatus,
  currentMeetingStatus,
  currentPilotStatus,
}: {
  leadId: string;
  currentStatus: LeadStatus;
  currentMeetingStatus: MeetingStatus;
  currentPilotStatus: PilotStatus;
}) {
  const [status, setStatus] = useState<LeadStatus>(currentStatus);
  const [meetingStatus, setMeetingStatus] = useState<MeetingStatus>(currentMeetingStatus);
  const [pilotStatus, setPilotStatus] = useState<PilotStatus>(currentPilotStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function updateStatus(payload: { status?: LeadStatus; meetingStatus?: MeetingStatus; pilotStatus?: PilotStatus }) {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/v1/leads/${leadId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: { message?: string } } | null;
        throw new Error(result?.error?.message ?? "Lead status could not be updated.");
      }

      if (payload.status) setStatus(payload.status);
      if (payload.meetingStatus) setMeetingStatus(payload.meetingStatus);
      if (payload.pilotStatus) setPilotStatus(payload.pilotStatus);
      setMessage("Pipeline status saved.");
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
          onChange={(event) => updateStatus({ status: event.target.value as LeadStatus })}
        >
          {leadStatuses.map((value) => (
            <option value={value} key={value}>{leadStatusLabels[value]}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Meeting tracking</span>
        <select
          value={meetingStatus}
          disabled={isSaving}
          onChange={(event) => updateStatus({ meetingStatus: event.target.value as MeetingStatus })}
        >
          {meetingStatuses.map((value) => (
            <option value={value} key={value}>{meetingStatusLabels[value]}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Pilot tracking</span>
        <select
          value={pilotStatus}
          disabled={isSaving}
          onChange={(event) => updateStatus({ pilotStatus: event.target.value as PilotStatus })}
        >
          {pilotStatuses.map((value) => (
            <option value={value} key={value}>{pilotStatusLabels[value]}</option>
          ))}
        </select>
      </label>
      {message ? <small>{message}</small> : null}
    </div>
  );
}
