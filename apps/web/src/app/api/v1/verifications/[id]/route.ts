import { handleError, ok, parseJson } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { updateVerificationSchema } from "@redist/shared";
import { getVerification, updateVerification } from "@/lib/verification";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser(request);
    const data = await getVerification(supabase, id);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser(request);
    const input = await parseJson(request, updateVerificationSchema);
    const data = await updateVerification(supabase, id, input);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
