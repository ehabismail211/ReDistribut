import { handleError, ok, parseJson } from "@/lib/api";
import { bearerToken, requireUser, supabaseClient } from "@/lib/supabase";
import { updateListingSchema } from "@redist/shared";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = supabaseClient({ authorization: bearerToken(request) });
    const { data, error } = await supabase
      .from("listings")
      .select("*, categories(name,slug,is_restricted), organizations(name,slug)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser(request);
    const input = await parseJson(request, updateListingSchema);
    const { data, error } = await supabase
      .from("listings")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
