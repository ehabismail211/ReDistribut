import type { SupabaseClient } from "@supabase/supabase-js";
import type { TrustScoreFactor, TrustScoreLevel } from "@redist/shared";

type Client = SupabaseClient;

export type TrustScoreInput = {
  verificationLevel: string;
  completedTransactions: number;
  averageResponseHours: number | null;
  acceptanceRate: number;
  cancellationRate: number;
  disputeRate: number;
  negativeAuditEvents: number;
  profileCompleteness: number;
  approvedDocuments: number;
  expiredDocuments: number;
  rejectedDocuments: number;
};

export type TrustScoreResult = {
  score: number;
  level: TrustScoreLevel;
  factors: TrustScoreFactor[];
};

const verificationPoints: Record<string, number> = {
  unverified: 0,
  basic_verified: 10,
  business_verified: 20,
  enterprise_verified: 25,
  ngo_verified: 20,
  government_verified: 25,
  "Unverified": 0,
  "Basic Verified": 10,
  "Business Verified": 20,
  "Enterprise Verified": 25,
  "NGO Verified": 20,
  "Government Verified": 25,
};

export function trustLevelForScore(score: number): TrustScoreLevel {
  if (score >= 85) return "platinum";
  if (score >= 70) return "gold";
  if (score >= 50) return "silver";
  return "bronze";
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function factor(key: string, label: string, points: number, detail: string): TrustScoreFactor {
  return { key, label, points, detail };
}

export function calculateTrustScore(input: TrustScoreInput): TrustScoreResult {
  const factors: TrustScoreFactor[] = [];

  factors.push(factor(
    "verification_level",
    `${input.verificationLevel} verification`,
    verificationPoints[input.verificationLevel] ?? 0,
    "Organization verification level contributes identity and compliance confidence.",
  ));

  const transactionPoints = Math.min(18, input.completedTransactions * 3);
  factors.push(factor(
    "completed_transactions",
    "Completed transactions",
    transactionPoints,
    `${input.completedTransactions} completed workflow${input.completedTransactions === 1 ? "" : "s"}.`,
  ));

  const responsePoints = input.averageResponseHours == null
    ? 0
    : input.averageResponseHours <= 4
      ? 10
      : input.averageResponseHours <= 24
        ? 6
        : input.averageResponseHours <= 72
          ? 3
          : -4;
  factors.push(factor(
    "response_time",
    "Response time",
    responsePoints,
    input.averageResponseHours == null ? "No response history yet." : `${input.averageResponseHours} hour average response time.`,
  ));

  const acceptancePoints = input.acceptanceRate >= 0.85 ? 10 : input.acceptanceRate >= 0.65 ? 6 : input.acceptanceRate >= 0.4 ? 2 : -6;
  factors.push(factor(
    "acceptance_rate",
    "Acceptance rate",
    acceptancePoints,
    `${Math.round(input.acceptanceRate * 100)}% of eligible requests accepted.`,
  ));

  const cancellationPenalty = input.cancellationRate >= 0.3 ? -15 : input.cancellationRate >= 0.15 ? -8 : input.cancellationRate > 0 ? -3 : 5;
  factors.push(factor(
    "cancellation_rate",
    "Cancellation rate",
    cancellationPenalty,
    `${Math.round(input.cancellationRate * 100)}% cancellation rate.`,
  ));

  const disputePenalty = input.disputeRate >= 0.2 ? -15 : input.disputeRate > 0 ? -8 : 5;
  factors.push(factor(
    "dispute_rate",
    "Dispute rate",
    disputePenalty,
    `${Math.round(input.disputeRate * 100)}% disputed workflows.`,
  ));

  const auditPenalty = input.negativeAuditEvents > 3 ? -10 : input.negativeAuditEvents > 0 ? -4 : 4;
  factors.push(factor(
    "audit_events",
    "Audit events",
    auditPenalty,
    `${input.negativeAuditEvents} negative audit event${input.negativeAuditEvents === 1 ? "" : "s"}.`,
  ));

  const profilePoints = Math.round(input.profileCompleteness * 10);
  factors.push(factor(
    "profile_completeness",
    "Profile completeness",
    profilePoints,
    `${Math.round(input.profileCompleteness * 100)}% profile completeness.`,
  ));

  const documentPoints = Math.min(10, input.approvedDocuments * 2) - (input.expiredDocuments * 8) - (input.rejectedDocuments * 5);
  factors.push(factor(
    "document_status",
    "Document status",
    documentPoints,
    `${input.approvedDocuments} approved, ${input.expiredDocuments} expired, ${input.rejectedDocuments} rejected.`,
  ));

  const score = clampScore(factors.reduce((total, item) => total + item.points, 35));
  return { score, level: trustLevelForScore(score), factors };
}

export async function getTrustScore(supabase: Client, organizationId: string) {
  const { data, error } = await supabase
    .from("organization_trust_scores")
    .select("*")
    .eq("organization_id", organizationId)
    .single();

  if (error) throw error;
  return data;
}

export async function listTrustScores(supabase: Client) {
  const { data, error } = await supabase
    .from("organization_trust_scores")
    .select("*, organizations(name, city, country_code)")
    .order("score", { ascending: false });

  if (error) throw error;
  return data;
}

export async function listTrustScoreHistory(supabase: Client, organizationId: string) {
  const { data, error } = await supabase
    .from("organization_trust_score_history")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function recordTrustScore(
  supabase: Client,
  organizationId: string,
  result: TrustScoreResult,
  reason: string,
) {
  const { data, error } = await supabase.rpc("record_trust_score", {
    target_organization_id: organizationId,
    target_score: result.score,
    target_factors: result.factors,
    target_reason: reason,
  });

  if (error) throw error;
  return data;
}
