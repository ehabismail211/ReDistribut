import { handleError, ok, parseJson } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { upsertProfileSchema } from "@redist/shared";

export async function GET(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

    if (error) throw error;
    return ok({ user, profile: data });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);
    const input = await parseJson(request, upsertProfileSchema);
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) throw error;
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
