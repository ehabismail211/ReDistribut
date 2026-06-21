import { created, handleError, ok, parseJson } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { createVerificationDocumentSchema } from "@redist/shared";
import { createVerificationDocument, listVerificationDocuments } from "@/lib/verification";
import { getVerificationOrganizationId, requirePermission } from "@/lib/permissions";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser(request);
    const organizationId = await getVerificationOrganizationId(supabase, id);
    await requirePermission({
      request,
      supabase,
      user,
      permission: "organization.read",
      organizationId,
      entityType: "verification_document",
    });
    const data = await listVerificationDocuments(supabase, id);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireUser(request);
    const input = await parseJson(request, createVerificationDocumentSchema);
    const organizationId = await getVerificationOrganizationId(supabase, id);
    await requirePermission({
      request,
      supabase,
      user,
      permission: "verification.create",
      organizationId,
      entityType: "verification_document",
    });
    const data = await createVerificationDocument(supabase, user, id, input);
    return created(data);
  } catch (error) {
    return handleError(error);
  }
}
