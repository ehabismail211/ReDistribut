import { leadInquiryLabels, type CreateLeadInput } from "./leads";
import { siteUrl } from "./site-url";

type LeadNotificationInput = {
  leadId: string;
  lead: CreateLeadInput;
};

type ResendEmailPayload = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function leadDashboardUrl(leadId: string) {
  return `${siteUrl()}/app/leads?lead=${encodeURIComponent(leadId)}`;
}

function buildLeadNotification({ leadId, lead }: LeadNotificationInput) {
  const dashboardUrl = leadDashboardUrl(leadId);
  const interestType = leadInquiryLabels[lead.inquiryType];
  const phone = lead.phone ?? "Not provided";

  const text = [
    "New ReDist lead submitted",
    "",
    `Lead ID: ${leadId}`,
    `Name: ${lead.name}`,
    `Organization: ${lead.organization}`,
    `Email: ${lead.email}`,
    `Phone: ${phone}`,
    `Interest Type: ${interestType}`,
    "",
    "Message:",
    lead.message,
    "",
    `Founder dashboard: ${dashboardUrl}`,
  ].join("\n");

  const rows = [
    ["Lead ID", leadId],
    ["Name", lead.name],
    ["Organization", lead.organization],
    ["Email", lead.email],
    ["Phone", phone],
    ["Interest Type", interestType],
  ];

  const html = `
    <div style="font-family: Arial, sans-serif; color: #10231f; line-height: 1.5;">
      <h1 style="margin: 0 0 16px;">New ReDist lead submitted</h1>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        <tbody>
          ${rows.map(([label, value]) => `
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #d8eadc; width: 160px;">${escapeHtml(label)}</th>
              <td style="padding: 8px; border-bottom: 1px solid #d8eadc;">${escapeHtml(value)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <h2 style="margin: 24px 0 8px; font-size: 18px;">Message</h2>
      <p style="white-space: pre-wrap; background: #f5faf7; border: 1px solid #d8eadc; border-radius: 8px; padding: 14px;">${escapeHtml(lead.message)}</p>
      <p style="margin-top: 24px;">
        <a href="${escapeHtml(dashboardUrl)}" style="display: inline-block; background: #0f8b68; color: #ffffff; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-weight: 700;">Open founder dashboard</a>
      </p>
    </div>
  `;

  return {
    dashboardUrl,
    subject: `New ReDist lead: ${lead.organization}`,
    text,
    html,
  };
}

export async function sendLeadNotification(input: LeadNotificationInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.LEAD_NOTIFICATION_TO?.trim() || process.env.FOUNDER_EMAIL?.trim();
  const from = process.env.LEAD_NOTIFICATION_FROM?.trim() || "ReDist Leads <notifications@redistribut.com>";

  if (!apiKey || !to) {
    console.warn("Lead notification skipped: RESEND_API_KEY and LEAD_NOTIFICATION_TO or FOUNDER_EMAIL must be configured.");
    return { sent: false, skipped: true };
  }

  const notification = buildLeadNotification(input);
  const payload: ResendEmailPayload = {
    from,
    to: [to],
    subject: notification.subject,
    text: notification.text,
    html: notification.html,
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Lead notification email failed with ${response.status}: ${details}`);
  }

  return { sent: true, skipped: false, dashboardUrl: notification.dashboardUrl };
}
