import { handleError, ok, parseJson } from "@/lib/api";
import { calculateImpactMetrics, recordImpactSnapshot } from "@/lib/impact";
import { requireUser } from "@/lib/supabase";
import { requirePermission } from "@/lib/permissions";
import { impactMetricSnapshotSchema } from "@redist/shared";
import { z } from "zod";

const impactListingSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  city: z.string().min(1),
  quantityAvailable: z.coerce.number().nonnegative().optional(),
  unit: z.string().min(1),
  unitPrice: z.coerce.number().nonnegative().optional().nullable(),
  status: z.string().min(1),
});

const impactRequestSchema = z.object({
  id: z.string().min(1),
  listingId: z.string().min(1),
  quantity: z.coerce.number().nonnegative(),
  status: z.string().min(1),
});

const calculationSchema = z.object({
  snapshot: impactMetricSnapshotSchema.pick({
    scope: true,
    user_id: true,
    organization_id: true,
    country_code: true,
    period_start: true,
    period_end: true,
  }),
  listings: z.array(impactListingSchema),
  requests: z.array(impactRequestSchema),
  source: z.record(z.string(), z.unknown()).optional().default({}),
  persist: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);
    const input = await parseJson(request, calculationSchema);
    if (input.persist) {
      await requirePermission({
        request,
        supabase,
        user,
        permission: "impact.calculate.persist",
        organizationId: input.snapshot.organization_id ?? null,
        entityType: "impact_history",
      });
    }
    const metrics = calculateImpactMetrics(input);
    const snapshot = impactMetricSnapshotSchema.parse({ ...input.snapshot, ...metrics });
    const saved = input.persist
      ? await recordImpactSnapshot(supabase, snapshot, { ...input.source, calculation: "api.v1.impact.calculate" })
      : null;

    return ok({ metrics, snapshot, saved });
  } catch (error) {
    return handleError(error);
  }
}
