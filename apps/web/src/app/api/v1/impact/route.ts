import { handleError, ok, searchParams } from "@/lib/api";
import { listImpactHistory } from "@/lib/impact";
import { requireUser } from "@/lib/supabase";
import { impactHistorySearchSchema } from "@redist/shared";

export async function GET(request: Request) {
  try {
    const { supabase } = await requireUser(request);
    const filters = impactHistorySearchSchema.parse(searchParams(request));
    const data = await listImpactHistory(supabase, filters);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
