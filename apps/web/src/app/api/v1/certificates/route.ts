import { created, handleError, ok, parseJson, searchParams } from "@/lib/api";
import { issueTransferCertificate, listTransferCertificates } from "@/lib/transfer-certificate";
import { requireUser } from "@/lib/supabase";
import { createTransferCertificateSchema, transferCertificateSearchSchema } from "@redist/shared";

export async function GET(request: Request) {
  try {
    const { supabase } = await requireUser(request);
    const filters = transferCertificateSearchSchema.parse(searchParams(request));
    const data = await listTransferCertificates(supabase, filters);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireUser(request);
    const input = await parseJson(request, createTransferCertificateSchema);
    const data = await issueTransferCertificate(supabase, { ...input, currency: input.currency ?? "AED" });
    return created(data);
  } catch (error) {
    return handleError(error);
  }
}
