import { fail, handleError } from "@/lib/api";
import { requireUser } from "@/lib/supabase";
import { generateTransferCertificatePdf, publicCertificateFromToken } from "@/lib/transfer-certificate";

type Params = { params: Promise<unknown> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params as { id: string };
    await requireUser(request);
    const certificate = publicCertificateFromToken(id);
    if (!certificate) {
      return fail("Certificate not found.", 404, { certificate_id: id });
    }

    const pdf = generateTransferCertificatePdf(certificate);

    return new Response(pdf, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${certificate.certificate_number}.pdf"`,
        "cache-control": "private, no-store",
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
