import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { getRequestScope, requireRequesterOrPermission } from "@/lib/permissions";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser(request);
    const scope = await getRequestScope(supabase, id);
    await requireRequesterOrPermission({
      request,
      supabase,
      user,
      requesterId: scope.requesterId,
      permission: "request.manage",
      organizationId: scope.organizationId,
      entityType: "listing_request",
      entityId: id,
    });
    const { data, error } = await supabase.rpc("cancel_listing_request", { target_request_id: id });

    if (error) throw error;
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
