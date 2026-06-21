import { created, handleError, parseJson } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { createListingRequestSchema } from "@redist/shared";
import { requirePermission } from "@/lib/permissions";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser(request);
    const input = await parseJson(request, createListingRequestSchema);
    await requirePermission({
      request,
      supabase,
      user,
      permission: "request.create",
      entityType: "listing_request",
      entityId: id,
    });
    const { data, error } = await supabase
      .from("listing_requests")
      .insert({ ...input, listing_id: id, requester_id: user.id })
      .select("*")
      .single();

    if (error) throw error;
    return created(data);
  } catch (error) {
    return handleError(error);
  }
}
