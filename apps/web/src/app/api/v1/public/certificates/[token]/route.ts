import { handleError, ok } from "@/lib/api";
import { publicCertificateFromToken } from "@/lib/transfer-certificate";

type Params = { params: Promise<unknown> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { token } = await params as { token: string };
    const certificate = publicCertificateFromToken(token);
    if (!certificate) {
      return ok({
        valid: false,
        status: "invalid",
        certificate_id: null,
        sender: null,
        receiver: null,
        transfer_date: null,
        resource_summary: null,
      });
    }

    return ok({
      valid: certificate.status === "issued",
      status: certificate.status,
      certificate_id: certificate.certificate_number,
      sender: certificate.sender_organization_name,
      receiver: certificate.receiver_organization_name,
      transfer_date: certificate.transfer_date,
      resource_summary: {
        item_name: certificate.item_name,
        category: certificate.category,
        quantity: certificate.quantity,
        unit: certificate.unit,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
