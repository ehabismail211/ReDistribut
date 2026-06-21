import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { getListingOrganizationId, requirePermission } from "@/lib/permissions";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser(request);
    const organizationId = await getListingOrganizationId(supabase, id);
    await requirePermission({
      request,
      supabase,
      user,
      permission: "listing.manage",
      organizationId,
      entityType: "listing",
      entityId: id,
    });
    const { data, error } = await supabase.rpc("publish_listing", { target_listing_id: id });

    if (error) throw error;
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
