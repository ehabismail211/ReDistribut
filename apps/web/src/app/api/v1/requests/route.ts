import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { supabase } = await requireUser(request);
    const { data, error } = await supabase
      .from("listing_requests")
      .select("*, listings(title,unit,city,country_code,organization_id,organizations(name,slug))")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
