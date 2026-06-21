import { handleError, ok, parseJson } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { calculateTrustScore, recordTrustScore } from "@/lib/trust-score";
import { requirePermission } from "@/lib/permissions";
import { recalculateTrustScoreSchema } from "@redist/shared";
import { z } from "zod";

const recalculationSchema = recalculateTrustScoreSchema.extend({
  metrics: z.object({
    verificationLevel: z.string().min(2),
    completedTransactions: z.coerce.number().int().min(0),
    averageResponseHours: z.coerce.number().nonnegative().nullable(),
    acceptanceRate: z.coerce.number().min(0).max(1),
    cancellationRate: z.coerce.number().min(0).max(1),
    disputeRate: z.coerce.number().min(0).max(1),
    negativeAuditEvents: z.coerce.number().int().min(0),
    profileCompleteness: z.coerce.number().min(0).max(1),
    approvedDocuments: z.coerce.number().int().min(0),
    expiredDocuments: z.coerce.number().int().min(0),
    rejectedDocuments: z.coerce.number().int().min(0),
  }),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser(request);
    await requirePermission({
      request,
      supabase,
      user,
      permission: "trust.recalculate",
      organizationId: id,
      entityType: "trust_score",
    });
    const input = await parseJson(request, recalculationSchema);
    const result = calculateTrustScore(input.metrics);
    const data = await recordTrustScore(supabase, id, result, input.reason ?? "manual_recalculation");

    return ok({ score: data, calculation: result });
  } catch (error) {
    return handleError(error);
  }
}
