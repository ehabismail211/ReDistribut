import { handleError, ok, parseJson } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { updateVerificationDocumentSchema } from "@redist/shared";
import { updateVerificationDocument } from "@/lib/verification";
import { getVerificationOrganizationId, requirePermission } from "@/lib/permissions";

type Params = { params: Promise<{ id: string; documentId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id, documentId } = await params;
    const { supabase, user } = await requireUser(request);
    const input = await parseJson(request, updateVerificationDocumentSchema);
    const organizationId = await getVerificationOrganizationId(supabase, id);
    await requirePermission({
      request,
      supabase,
      user,
      permission: input.status_code ? "verification.document.review" : "verification.create",
      organizationId,
      entityType: "verification_document",
      entityId: documentId,
    });
    const data = await updateVerificationDocument(supabase, user, id, documentId, input);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
