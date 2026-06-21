import { handleError, ok, searchParams } from "@/lib/api";
import { requirePermission } from "@/lib/permissions";
import { requireUser } from "@/lib/supabase";
import { z } from "zod";

const auditSearchSchema = z.object({
  organization_id: z.string().uuid().optional(),
  entity_type: z.string().trim().min(2).max(80).optional(),
  event_type: z.string().trim().min(2).max(120).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);
    const params = auditSearchSchema.parse(searchParams(request));
    await requirePermission({
      request,
      supabase,
      user,
      permission: "audit.read",
      organizationId: params.organization_id,
      entityType: "audit_event",
    });

    let query = supabase
      .from("audit_events")
      .select("*")
      .order("created_at", { ascending: false })
      .range(params.offset, params.offset + params.limit - 1);

    if (params.organization_id) {
      query = query.or(`details->>organization_id.eq.${params.organization_id},details->>sender_organization_id.eq.${params.organization_id},details->>receiver_organization_id.eq.${params.organization_id}`);
    }

    if (params.entity_type) query = query.eq("entity_type", params.entity_type);
    if (params.event_type) query = query.eq("event_type", params.event_type);

    const { data, error } = await query;
    if (error) throw error;
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
