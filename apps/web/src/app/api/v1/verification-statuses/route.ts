import { handleError, ok } from "@/lib/api";
import { supabaseClient } from "@/lib/supabase";
import { listVerificationStatuses } from "@/lib/verification";

export async function GET() {
  try {
    const supabase = supabaseClient();
    const statuses = await listVerificationStatuses(supabase);
    return ok(statuses);
  } catch (error) {
    return handleError(error);
  }
}
