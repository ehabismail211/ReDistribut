import { created, handleError, ok, parseJson, searchParams } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { createVerificationSchema } from "@redist/shared";
import { createVerification, listVerifications } from "@/lib/verification";
import { requirePermission } from "@/lib/permissions";

export async function GET(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);
    const params = searchParams(request);
    const organizationId = typeof params.organization_id === "string" ? params.organization_id : undefined;
    await requirePermission({
      request,
      supabase,
      user,
      permission: organizationId ? "organization.read" : "verification.review",
      organizationId,
      entityType: "organization_verification",
    });
    const data = await listVerifications(supabase, organizationId);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);
    const input = await parseJson(request, createVerificationSchema);
    await requirePermission({
      request,
      supabase,
      user,
      permission: "verification.create",
      organizationId: input.organization_id,
      entityType: "organization_verification",
    });
    const data = await createVerification(supabase, user, input);
    return created(data);
  } catch (error) {
    return handleError(error);
  }
}
