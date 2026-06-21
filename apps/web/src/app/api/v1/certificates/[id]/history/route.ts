import { handleError, ok } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { requirePermission } from "@/lib/permissions";

type Params = { params: Promise<unknown> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params as { id: string };
    const { supabase, user } = await requireUser(request);
    await requirePermission({
      request,
      supabase,
      user,
      permission: "audit.read",
      entityType: "transfer_certificate",
      entityId: id,
    });
    const { data, error } = await supabase
      .from("transfer_certificate_history")
      .select("*")
      .eq("certificate_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
