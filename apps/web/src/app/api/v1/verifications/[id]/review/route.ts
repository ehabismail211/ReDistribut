import { handleError, ok, parseJson } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { reviewVerificationSchema } from "@redist/shared";
import { reviewVerification } from "@/lib/verification";
import { getVerificationOrganizationId, requirePermission } from "@/lib/permissions";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser(request);
    const organizationId = await getVerificationOrganizationId(supabase, id);
    await requirePermission({
      request,
      supabase,
      user,
      permission: "verification.review",
      organizationId,
      entityType: "organization_verification",
      entityId: id,
    });
    const input = await parseJson(request, reviewVerificationSchema);
    const data = await reviewVerification(supabase, user, id, input);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
