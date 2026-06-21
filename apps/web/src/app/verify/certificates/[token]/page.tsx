import Link from "next/link";
import { publicCertificateFromToken } from "@/lib/transfer-certificate";

type Params = { params: Promise<unknown>; searchParams?: Promise<unknown> };

const ar = {
  "QR verification": "التحقق عبر QR",
  "Certificate valid": "الشهادة صالحة",
  "Certificate invalid": "الشهادة غير صالحة",
  "Public-safe verification for a completed ReDist redistribution transfer.": "تحقق عام آمن لعملية إعادة توزيع مكتملة على ReDist.",
  "This QR token does not match a valid public ReDist certificate.": "رمز QR هذا لا يطابق شهادة ReDist عامة صالحة.",
  "No certificate found": "لم يتم العثور على شهادة",
  "invalid": "غير صالح",
  "Sender": "المرسل",
  "Receiver": "المستلم",
  "Transfer date": "تاريخ التحويل",
  "Resource summary": "ملخص المورد",
  "This public page verifies the certificate status and essential transfer facts only. Sensitive transaction notes, documents, contact details, and internal audit records are not exposed.": "تتحقق هذه الصفحة العامة من حالة الشهادة وحقائق التحويل الأساسية فقط. لا يتم عرض ملاحظات التحويل الحساسة أو المستندات أو بيانات الاتصال أو سجلات التدقيق الداخلية.",
  "Back to ReDist": "العودة إلى ReDist",
};

function t(locale: "en" | "ar", value: string) {
  return locale === "ar" ? ar[value as keyof typeof ar] ?? value : value;
}

export default async function CertificateVerificationPage({ params, searchParams }: Params) {
  const { token } = await params as { token: string };
  const query = await searchParams as { lang?: string } | undefined;
  const locale = query?.lang === "ar" ? "ar" : "en";
  const dir = locale === "ar" ? "rtl" : "ltr";
  const certificate = publicCertificateFromToken(token);
  const valid = certificate?.status === "issued";

  return (
    <main className="public-certificate-page" dir={dir} lang={locale}>
      <section className="public-certificate-card">
        <div className="public-certificate-header">
          <span className="proto-mark">RD</span>
          <div>
            <span className="eyebrow">{t(locale, "QR verification")}</span>
            <h1>{valid ? t(locale, "Certificate valid") : t(locale, "Certificate invalid")}</h1>
            <p>{valid ? t(locale, "Public-safe verification for a completed ReDist redistribution transfer.") : t(locale, "This QR token does not match a valid public ReDist certificate.")}</p>
          </div>
        </div>

        <div className="public-certificate-status">
          <strong>{certificate?.certificate_number ?? t(locale, "No certificate found")}</strong>
          <span>{certificate?.status ?? t(locale, "invalid")}</span>
        </div>

        {certificate ? (
          <div className="public-certificate-grid">
            <div>
              <span>{t(locale, "Sender")}</span>
              <strong>{certificate.sender_organization_name}</strong>
            </div>
            <div>
              <span>{t(locale, "Receiver")}</span>
              <strong>{certificate.receiver_organization_name}</strong>
            </div>
            <div>
              <span>{t(locale, "Transfer date")}</span>
              <strong>{new Date(certificate.transfer_date).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-AE", { year: "numeric", month: "short", day: "numeric" })}</strong>
            </div>
            <div>
              <span>{t(locale, "Resource summary")}</span>
              <strong>{certificate.item_name}</strong>
              <p>{certificate.quantity.toLocaleString(locale === "ar" ? "ar-AE" : "en-US")} {certificate.unit} · {certificate.category}</p>
            </div>
          </div>
        ) : null}

        <p className="certificate-disclaimer">
          {t(locale, "This public page verifies the certificate status and essential transfer facts only. Sensitive transaction notes, documents, contact details, and internal audit records are not exposed.")}
        </p>

        <Link className="button secondary" href="/">{t(locale, "Back to ReDist")}</Link>
      </section>
    </main>
  );
}
