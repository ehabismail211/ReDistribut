import { created, handleError, ok, parseJson, searchParams } from "@/lib/api";
import { bearerToken, requireUser, supabaseClient } from "@/lib/supabase";
import { createListingSchema, listingSearchSchema } from "@redist/shared";
import { requirePermission } from "@/lib/permissions";

export async function GET(request: Request) {
  try {
    const params = listingSearchSchema.parse(searchParams(request));
    const supabase = supabaseClient({ authorization: bearerToken(request) });
    let query = supabase
      .from("listings")
      .select("*, categories(name,slug,is_restricted), organizations(name,slug)")
      .order("published_at", { ascending: false, nullsFirst: false })
      .range(params.offset, params.offset + params.limit - 1);

    if (params.category) query = query.eq("category_id", params.category);
    if (params.offer_type) query = query.eq("offer_type", params.offer_type);
    if (params.city) query = query.ilike("city", params.city);
    if (params.country_code) query = query.eq("country_code", params.country_code);
    if (params.q) query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);

    const { data, error } = await query;
    if (error) throw error;
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);
    const input = await parseJson(request, createListingSchema);
    await requirePermission({
      request,
      supabase,
      user,
      permission: "listing.create",
      organizationId: input.organization_id,
      entityType: "listing",
    });
    const { data, error } = await supabase
      .from("listings")
      .insert({
        ...input,
        created_by: user.id,
        quantity_available: input.quantity_total,
      })
      .select("*")
      .single();

    if (error) throw error;
    return created(data);
  } catch (error) {
    return handleError(error);
  }
}
