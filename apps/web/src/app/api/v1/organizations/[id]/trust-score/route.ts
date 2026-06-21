import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { getTrustScore, listTrustScoreHistory } from "@/lib/trust-score";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser(request);
    const [score, history] = await Promise.all([
      getTrustScore(supabase, id),
      listTrustScoreHistory(supabase, id),
    ]);

    return ok({ score, history });
  } catch (error) {
    return handleError(error);
  }
}
