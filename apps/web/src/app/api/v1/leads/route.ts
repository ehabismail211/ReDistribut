import { created, handleError, ok, parseJson } from "@/lib/api";
import { sendLeadNotification } from "@/lib/lead-notifications";
import { createLeadSchema, createMarketingLead, listMarketingLeads } from "@/lib/leads";
import { requireRoutePermission } from "@/lib/permissions";
import { requireUser } from "@/lib/supabase";

const rateLimitWindowMs = 10 * 60 * 1000;
const maxSubmissionsPerWindow = 5;
const submissionLog = new Map<string, number[]>();

function requesterIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? null;
  return request.headers.get("x-real-ip");
}

function assertRateLimit(ip: string | null) {
  const key = ip ?? "unknown";
  const now = Date.now();
  const recent = (submissionLog.get(key) ?? []).filter((timestamp) => now - timestamp < rateLimitWindowMs);

  if (recent.length >= maxSubmissionsPerWindow) {
    const error = new Error("Too many inquiries submitted. Please try again later.") as Error & { status: number };
    error.status = 429;
    throw error;
  }

  submissionLog.set(key, [...recent, now]);
}

function assertHumanSubmission(renderedAt: string, honeypot: string) {
  if (honeypot) {
    const error = new Error("Inquiry rejected.") as Error & { status: number };
    error.status = 400;
    throw error;
  }

  const elapsedMs = Date.now() - Date.parse(renderedAt);
  if (!Number.isFinite(elapsedMs) || elapsedMs < 2500) {
    const error = new Error("Please review the form before submitting.") as Error & { status: number };
    error.status = 400;
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, createLeadSchema);
    assertHumanSubmission(input.renderedAt, input.website);

    const ip = requesterIp(request);
    assertRateLimit(ip);

    const data = await createMarketingLead(input, {
      ip,
      userAgent: request.headers.get("user-agent"),
    });

    try {
      await sendLeadNotification({ leadId: data.id, lead: input });
    } catch (notificationError) {
      console.error("Lead notification email failed after lead persistence.", notificationError);
    }

    return created(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);
    await requireRoutePermission({
      request,
      supabase,
      user,
      permission: "founder.route.access",
    });

    const data = await listMarketingLeads();
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
