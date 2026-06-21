import type { SupabaseClient } from "@supabase/supabase-js";

export type VerificationRecord = {
  id: string;
  organization_id: string;
  status_code: string;
  level: string;
  country_code: string;
};

export type VerificationDocumentRecord = {
  id: string;
  verification_id: string;
  organization_id: string;
  status_code: string;
};

export type VerificationAuditInput = {
  organizationId: string;
  verificationId?: string | null;
  documentId?: string | null;
  eventType: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  details?: Record<string, unknown>;
};

type Client = SupabaseClient;

export async function getVerificationOrThrow(supabase: Client, verificationId: string) {
  const { data, error } = await supabase
    .from("organization_verifications")
    .select("*")
    .eq("id", verificationId)
    .single<VerificationRecord>();

  if (error) throw error;
  return data;
}

export async function recordVerificationAudit(supabase: Client, input: VerificationAuditInput) {
  const { error } = await supabase.rpc("record_verification_audit_event", {
    target_organization_id: input.organizationId,
    target_verification_id: input.verificationId ?? null,
    target_document_id: input.documentId ?? null,
    target_event_type: input.eventType,
    previous_status: input.fromStatus ?? null,
    next_status: input.toStatus ?? null,
    event_details: input.details ?? {},
  });

  if (error) throw error;
}

export async function listVerificationStatuses(supabase: Client) {
  const { data, error } = await supabase
    .from("verification_statuses")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function listVerifications(supabase: Client, organizationId?: string) {
  let query = supabase
    .from("organization_verifications")
    .select("*, verification_documents(*), verification_audit_events(*)")
    .order("updated_at", { ascending: false });

  if (organizationId) query = query.eq("organization_id", organizationId);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getVerification(supabase: Client, verificationId: string) {
  const { data, error } = await supabase
    .from("organization_verifications")
    .select("*, verification_documents(*), verification_audit_events(*)")
    .eq("id", verificationId)
    .single();

  if (error) throw error;
  return data;
}

export async function insertVerification(
  supabase: Client,
  payload: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from("organization_verifications")
    .insert(payload)
    .select("*")
    .single<VerificationRecord>();

  if (error) throw error;
  return data;
}

export async function updateVerificationRecord(
  supabase: Client,
  verificationId: string,
  payload: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from("organization_verifications")
    .update(payload)
    .eq("id", verificationId)
    .select("*")
    .single<VerificationRecord>();

  if (error) throw error;
  return data;
}

export async function listVerificationDocuments(supabase: Client, verificationId: string) {
  const { data, error } = await supabase
    .from("verification_documents")
    .select("*")
    .eq("verification_id", verificationId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function insertVerificationDocument(
  supabase: Client,
  payload: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from("verification_documents")
    .insert(payload)
    .select("*")
    .single<VerificationDocumentRecord>();

  if (error) throw error;
  return data;
}

export async function getVerificationDocumentForVerification(
  supabase: Client,
  verificationId: string,
  documentId: string,
) {
  const { data, error } = await supabase
    .from("verification_documents")
    .select("*")
    .eq("id", documentId)
    .eq("verification_id", verificationId)
    .single<VerificationDocumentRecord>();

  if (error) throw error;
  return data;
}

export async function updateVerificationDocumentRecord(
  supabase: Client,
  verificationId: string,
  documentId: string,
  payload: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from("verification_documents")
    .update(payload)
    .eq("id", documentId)
    .eq("verification_id", verificationId)
    .select("*")
    .single<VerificationDocumentRecord>();

  if (error) throw error;
  return data;
}
