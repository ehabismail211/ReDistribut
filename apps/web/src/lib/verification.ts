import type { SupabaseClient, User } from "@supabase/supabase-js";
import type {
  CreateVerificationDocumentInput,
  CreateVerificationInput,
  ReviewVerificationInput,
  SubmitVerificationInput,
  UpdateVerificationDocumentInput,
  UpdateVerificationInput,
} from "@redist/shared";
import * as repository from "./verification-repository";

type Client = SupabaseClient;

type CreateVerificationPayload = Omit<CreateVerificationInput, "level" | "status_code"> &
  Partial<Pick<CreateVerificationInput, "level" | "status_code">>;

export async function listVerificationStatuses(supabase: Client) {
  return repository.listVerificationStatuses(supabase);
}

export async function listVerifications(supabase: Client, organizationId?: string) {
  return repository.listVerifications(supabase, organizationId);
}

export async function getVerification(supabase: Client, verificationId: string) {
  return repository.getVerification(supabase, verificationId);
}

export async function createVerification(
  supabase: Client,
  user: User,
  input: CreateVerificationPayload,
) {
  const data = await repository.insertVerification(supabase, {
    organization_id: input.organization_id,
    country_code: input.country_code,
    level: input.level ?? "unverified",
    status_code: input.status_code ?? "draft",
    expires_at: input.expires_at,
    review_notes: input.review_notes,
    internal_notes: input.internal_notes,
    created_by: user.id,
  });

  await repository.recordVerificationAudit(supabase, {
    organizationId: data.organization_id,
    verificationId: data.id,
    eventType: "verification.created",
    toStatus: data.status_code,
    details: { level: data.level, country_code: data.country_code },
  });

  return data;
}

export async function updateVerification(
  supabase: Client,
  verificationId: string,
  input: UpdateVerificationInput,
) {
  const current = await repository.getVerificationOrThrow(supabase, verificationId);
  const data = await repository.updateVerificationRecord(supabase, verificationId, {
    ...input,
    updated_at: new Date().toISOString(),
  });

  await repository.recordVerificationAudit(supabase, {
    organizationId: data.organization_id,
    verificationId: data.id,
    eventType: "verification.updated",
    fromStatus: current.status_code,
    toStatus: data.status_code,
    details: { previous_level: current.level, level: data.level },
  });

  return data;
}

export async function submitVerification(
  supabase: Client,
  user: User,
  verificationId: string,
  input: SubmitVerificationInput,
) {
  const current = await repository.getVerificationOrThrow(supabase, verificationId);
  const now = new Date().toISOString();
  const data = await repository.updateVerificationRecord(supabase, verificationId, {
    status_code: "pending_review",
    submitted_by: user.id,
    submitted_at: now,
    updated_at: now,
    internal_notes: input.notes ?? undefined,
  });

  await repository.recordVerificationAudit(supabase, {
    organizationId: data.organization_id,
    verificationId: data.id,
    eventType: "verification.submitted",
    fromStatus: current.status_code,
    toStatus: data.status_code,
    details: { notes: input.notes ?? null },
  });

  return data;
}

export async function reviewVerification(
  supabase: Client,
  user: User,
  verificationId: string,
  input: ReviewVerificationInput,
) {
  const current = await repository.getVerificationOrThrow(supabase, verificationId);
  const now = new Date().toISOString();
  const data = await repository.updateVerificationRecord(supabase, verificationId, {
    status_code: input.status_code,
    level: input.level ?? current.level,
    expires_at: input.expires_at,
    review_notes: input.review_notes,
    internal_notes: input.internal_notes,
    reviewed_by: user.id,
    reviewed_at: now,
    updated_at: now,
  });

  await repository.recordVerificationAudit(supabase, {
    organizationId: data.organization_id,
    verificationId: data.id,
    eventType: `verification.${input.status_code}`,
    fromStatus: current.status_code,
    toStatus: data.status_code,
    details: {
      previous_level: current.level,
      level: data.level,
      review_notes: input.review_notes ?? null,
    },
  });

  return data;
}

export async function listVerificationDocuments(supabase: Client, verificationId: string) {
  return repository.listVerificationDocuments(supabase, verificationId);
}

export async function createVerificationDocument(
  supabase: Client,
  user: User,
  verificationId: string,
  input: CreateVerificationDocumentInput,
) {
  const verification = await repository.getVerificationOrThrow(supabase, verificationId);
  const data = await repository.insertVerificationDocument(supabase, {
    ...input,
    verification_id: verification.id,
    organization_id: verification.organization_id,
    created_by: user.id,
  });

  await repository.recordVerificationAudit(supabase, {
    organizationId: data.organization_id,
    verificationId: data.verification_id,
    documentId: data.id,
    eventType: "verification.document.created",
    toStatus: data.status_code,
    details: { document_type: input.document_type, expiry_date: input.expiry_date ?? null },
  });

  return data;
}

export async function updateVerificationDocument(
  supabase: Client,
  user: User,
  verificationId: string,
  documentId: string,
  input: UpdateVerificationDocumentInput,
) {
  const current = await repository.getVerificationDocumentForVerification(
    supabase,
    verificationId,
    documentId,
  );

  const nextStatus = input.status_code;
  const reviewerPatch = nextStatus && nextStatus !== current.status_code
    ? { reviewed_by: user.id, reviewed_at: new Date().toISOString() }
    : {};

  const data = await repository.updateVerificationDocumentRecord(
    supabase,
    verificationId,
    documentId,
    { ...input, ...reviewerPatch, updated_at: new Date().toISOString() },
  );

  await repository.recordVerificationAudit(supabase, {
    organizationId: data.organization_id,
    verificationId: data.verification_id,
    documentId: data.id,
    eventType: "verification.document.updated",
    fromStatus: current.status_code,
    toStatus: data.status_code,
    details: { reviewed: Boolean(reviewerPatch.reviewed_by) },
  });

  return data;
}
