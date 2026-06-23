import { z } from "zod";
import { supabaseClient } from "./supabase";

export const leadStatuses = [
  "new",
  "contacted",
  "meeting_booked",
  "pilot_candidate",
  "archived",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New leads",
  contacted: "Contacted",
  meeting_booked: "Meeting booked",
  pilot_candidate: "Pilot candidate",
  archived: "Archived",
};

export const leadInquiryTypes = [
  "pilot",
  "supplier",
  "recipient",
  "partner",
  "impact",
  "demo",
  "question",
] as const;

export const leadInquiryLabels: Record<(typeof leadInquiryTypes)[number], string> = {
  pilot: "Pilot interest",
  supplier: "Supplier inquiry",
  recipient: "Recipient inquiry",
  partner: "Partnership request",
  impact: "Impact / ESG discussion",
  demo: "Founder walkthrough",
  question: "General question",
};

export const meetingStatuses = [
  "not_scheduled",
  "scheduled",
  "completed",
  "follow_up_required",
] as const;

export type MeetingStatus = (typeof meetingStatuses)[number];

export const meetingStatusLabels: Record<MeetingStatus, string> = {
  not_scheduled: "Not scheduled",
  scheduled: "Scheduled",
  completed: "Completed",
  follow_up_required: "Follow-up required",
};

export const pilotStatuses = [
  "not_invited",
  "invited",
  "accepted",
  "onboarding",
  "active",
  "completed",
] as const;

export type PilotStatus = (typeof pilotStatuses)[number];

export const pilotStatusLabels: Record<PilotStatus, string> = {
  not_invited: "Not invited",
  invited: "Invited",
  accepted: "Accepted",
  onboarding: "Onboarding",
  active: "Active",
  completed: "Completed",
};

export const createLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(40).optional().transform((value) => value || null),
  inquiryType: z.enum(leadInquiryTypes),
  message: z.string().trim().min(10).max(2000),
  organizationType: z.string().trim().max(120).optional().transform((value) => value || null),
  role: z.string().trim().max(120).optional().transform((value) => value || null),
  city: z.string().trim().max(120).optional().transform((value) => value || null),
  timeline: z.string().trim().max(80).optional().transform((value) => value || null),
  consent: z.literal(true),
  website: z.string().trim().max(0).optional().default(""),
  renderedAt: z.string().datetime(),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(leadStatuses).optional(),
  meetingStatus: z.enum(meetingStatuses).optional(),
  pilotStatus: z.enum(pilotStatuses).optional(),
}).refine((input) => input.status || input.meetingStatus || input.pilotStatus, {
  message: "At least one lead, meeting, or pilot status is required.",
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export type MarketingLead = {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string | null;
  inquiry_type: (typeof leadInquiryTypes)[number];
  message: string;
  status: LeadStatus;
  meeting_status: MeetingStatus;
  meeting_status_updated_at: string | null;
  pilot_status: PilotStatus;
  pilot_status_updated_at: string | null;
  organization_type: string | null;
  role_title: string | null;
  city: string | null;
  timeline: string | null;
  source: string;
  created_at: string;
  updated_at: string;
  contacted_at: string | null;
};

function serviceSupabase() {
  return supabaseClient({ serviceRole: true });
}

export async function createMarketingLead(input: CreateLeadInput, context: { ip?: string | null; userAgent?: string | null }) {
  const supabase = serviceSupabase();
  const { data, error } = await supabase
    .from("marketing_leads")
    .insert({
      name: input.name,
      organization: input.organization,
      email: input.email.toLowerCase(),
      phone: input.phone,
      inquiry_type: input.inquiryType,
      message: input.message,
      organization_type: input.organizationType,
      role_title: input.role,
      city: input.city,
      timeline: input.timeline,
      source: "marketing_contact_form",
      ip_address: context.ip,
      user_agent: context.userAgent,
    })
    .select("id, name, organization, email, inquiry_type, status, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function listMarketingLeads() {
  const supabase = serviceSupabase();
  const { data, error } = await supabase
    .from("marketing_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<MarketingLead[]>();

  if (error) throw error;
  return data ?? [];
}

export async function updateMarketingLeadStatus(
  id: string,
  input: { status?: LeadStatus; meetingStatus?: MeetingStatus; pilotStatus?: PilotStatus },
) {
  const supabase = serviceSupabase();
  const now = new Date().toISOString();
  const patch: {
    status?: LeadStatus;
    meeting_status?: MeetingStatus;
    meeting_status_updated_at?: string;
    pilot_status?: PilotStatus;
    pilot_status_updated_at?: string;
    contacted_at?: string | null;
  } = {};

  if (input.status) {
    patch.status = input.status;
  }

  if (input.meetingStatus) {
    patch.meeting_status = input.meetingStatus;
    patch.meeting_status_updated_at = now;
  }

  if (input.pilotStatus) {
    patch.pilot_status = input.pilotStatus;
    patch.pilot_status_updated_at = now;
  }

  if (
    input.status === "contacted" ||
    input.status === "meeting_booked" ||
    input.status === "pilot_candidate" ||
    input.meetingStatus === "scheduled" ||
    input.meetingStatus === "completed" ||
    input.meetingStatus === "follow_up_required" ||
    input.pilotStatus === "invited" ||
    input.pilotStatus === "accepted" ||
    input.pilotStatus === "onboarding" ||
    input.pilotStatus === "active"
  ) {
    patch.contacted_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("marketing_leads")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single<MarketingLead>();

  if (error) throw error;
  return data;
}
