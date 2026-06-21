import { handleError, ok, parseJson } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { submitVerificationSchema } from "@redist/shared";
import { submitVerification } from "@/lib/verification";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser(request);
    const input = await parseJson(request, submitVerificationSchema);
    const data = await submitVerification(supabase, user, id, input);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
