import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { listTrustScores } from "@/lib/trust-score";

export async function GET(request: Request) {
  try {
    const { supabase } = await requireUser(request);
    const data = await listTrustScores(supabase);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
