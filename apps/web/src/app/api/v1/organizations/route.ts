import { created, handleError, ok, parseJson } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { createOrganizationSchema } from "@redist/shared";
import { requirePermission } from "@/lib/permissions";

export async function GET(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);
    await requirePermission({
      request,
      supabase,
      user,
      permission: "organization.read",
      entityType: "organization",
    });
    const { data, error } = await supabase
      .from("organizations")
      .select("*, organization_members!inner(role)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);
    const input = await parseJson(request, createOrganizationSchema);
    const { data, error } = await supabase
      .from("organizations")
      .insert({ ...input, created_by: user.id })
      .select("*")
      .single();

    if (error) throw error;
    return created(data);
  } catch (error) {
    return handleError(error);
  }
}
