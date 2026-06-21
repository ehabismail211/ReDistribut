import { handleError, ok } from "@/lib/api";
import { supabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = supabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,slug,is_restricted,is_active")
      .eq("is_active", true)
      .order("name");

    if (error) throw error;
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
