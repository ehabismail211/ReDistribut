import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { getRequestScope, requirePermission } from "@/lib/permissions";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser(request);
    const scope = await getRequestScope(supabase, id);
    await requirePermission({
      request,
      supabase,
      user,
      permission: "request.manage",
      organizationId: scope.organizationId,
      entityType: "listing_request",
      entityId: id,
    });
    const { data, error } = await supabase.rpc("decline_listing_request", { target_request_id: id });

    if (error) throw error;
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
