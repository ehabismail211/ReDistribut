import { handleError, ok } from "@/lib/api";
import { listImpactHistory } from "@/lib/impact";
import { requireUser } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser(request);
    const data = await listImpactHistory(supabase, {
      scope: "organization",
      organization_id: id,
      limit: 24,
      offset: 0,
    });

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
