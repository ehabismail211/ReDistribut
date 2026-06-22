import { handleError, ok, parseJson } from "@/lib/api";
import { updateLeadStatusSchema, updateMarketingLeadStatus } from "@/lib/leads";
import { requireRoutePermission } from "@/lib/permissions";
import { requireUser } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, user } = await requireUser(request);
    await requireRoutePermission({
      request,
      supabase,
      user,
      permission: "founder.route.access",
    });

    const { id } = await params;
    const input = await parseJson(request, updateLeadStatusSchema);
    const data = await updateMarketingLeadStatus(id, input.status);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
