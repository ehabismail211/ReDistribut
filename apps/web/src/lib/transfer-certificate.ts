import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CreateTransferCertificateInput,
  TransferCertificateSearchInput,
  TrustSnapshot,
  TransferCertificateImpactSnapshot,
} from "@redist/shared";

type Client = SupabaseClient;

export type TransferCertificateRecord = CreateTransferCertificateInput & {
  id: string;
  public_id: string;
  certificate_number: string;
  status: "issued" | "revoked" | "superseded" | "expired";
  qr_verification_token: string;
  certificate_hash: string;
  issued_at: string;
  pdf_storage_path?: string | null;
  history: Array<{ event: string; actor: string; at: string; detail: string }>;
};

function tokenSeed(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash).toString(36).padStart(8, "0");
}

export function createQrVerificationToken(parts: string[]) {
  const seed = tokenSeed(parts.join("|"));
  return `qr_${seed}_${Date.now().toString(36)}`;
}

export function createCertificateNumber(index: number, countryCode = "UAE") {
  return `RD-${countryCode}-${new Date().getFullYear()}-${String(index).padStart(6, "0")}`;
}

export function createCertificateHash(payload: Record<string, unknown>) {
  return tokenSeed(JSON.stringify(payload));
}

export function verificationUrl(token: string) {
  return `/verify/certificates/${encodeURIComponent(token)}`;
}

export function isValidQrVerificationToken(token: string) {
  return /^qr_[a-zA-Z0-9_-]{4,}/.test(token);
}

export function buildCertificatePayload(input: CreateTransferCertificateInput) {
  return {
    transaction_id: input.transaction_id,
    sender: input.sender_organization_name,
    receiver: input.receiver_organization_name,
    item_name: input.item_name,
    category: input.category,
    quantity: input.quantity,
    unit: input.unit,
    estimated_value: input.estimated_value,
    transfer_date: input.transfer_date,
    location: input.location,
    handover_method: input.handover_method,
    trust_snapshot: input.trust_snapshot,
    impact_snapshot: input.impact_snapshot,
  };
}

export function createLocalTransferCertificate(
  input: CreateTransferCertificateInput,
  sequence: number,
): TransferCertificateRecord {
  const payload = buildCertificatePayload(input);
  const token = createQrVerificationToken([input.transaction_id, input.item_name, input.transfer_date]);

  return {
    ...input,
    id: `certificate-${createCertificateHash(payload)}`,
    public_id: `cert_${createCertificateHash({ token, transaction: input.transaction_id })}`,
    certificate_number: createCertificateNumber(sequence),
    status: "issued",
    qr_verification_token: token,
    certificate_hash: createCertificateHash(payload),
    issued_at: new Date().toISOString(),
    pdf_storage_path: null,
    history: [
      {
        event: "certificate.issued",
        actor: "System",
        at: new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }),
        detail: `Certificate issued for ${input.quantity} ${input.unit} of ${input.item_name}.`,
      },
    ],
  };
}

export function publicCertificateFromToken(token: string): TransferCertificateRecord | null {
  if (!isValidQrVerificationToken(token)) return null;

  const trust: TrustSnapshot = {
    score: 82,
    level: "Gold",
    verification_level: "Business Verified",
    verification_status: "Verified",
  };
  const impact: TransferCertificateImpactSnapshot = {
    aed_recovered: 2160,
    resources_redistributed: 120,
    waste_prevented_kg: 54,
    co2_saved_kg: 228,
  };
  const input: CreateTransferCertificateInput = {
    transaction_id: "txn-demo-restaurant-001",
    listing_request_id: null,
    sender_organization_id: "00000000-0000-4000-8000-000000000001",
    receiver_organization_id: "00000000-0000-4000-8000-000000000002",
    sender_organization_name: "Demo Restaurant Group",
    receiver_organization_name: "Dubai Community NGO",
    item_name: "Prepared chicken meals",
    category: "Food and beverage",
    quantity: 120,
    unit: "meals",
    estimated_value: 2160,
    currency: "AED",
    transfer_date: "2026-06-20T10:30:00.000Z",
    location: "Dubai Marina, Dubai",
    handover_method: "Pickup",
    trust_snapshot: trust,
    impact_snapshot: impact,
  };

  return {
    ...createLocalTransferCertificate(input, 1),
    qr_verification_token: token,
    public_id: `cert_${createCertificateHash({ token })}`,
  };
}

function pdfEscape(value: string | number) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function qrCells(token: string) {
  return Array.from({ length: 49 }, (_, index) => {
    const code = token.charCodeAt(index % token.length) + index * 17;
    return code % 3 !== 0;
  });
}

function rectCommand(x: number, y: number, width: number, height: number) {
  return `${x} ${y} ${width} ${height} re f`;
}

export function generateTransferCertificatePdf(certificate: TransferCertificateRecord) {
  const lines = [
    "BT /F1 24 Tf 48 784 Td (ReDist Transfer Certificate) Tj ET",
    `BT /F1 12 Tf 48 758 Td (${pdfEscape(certificate.certificate_number)}) Tj ET`,
    "0 0.48 0.42 rg 48 734 500 2 re f 0 0 0 rg",
    `BT /F1 14 Tf 48 704 Td (Certificate valid) Tj ET`,
    `BT /F1 11 Tf 48 684 Td (Transfer date: ${pdfEscape(new Date(certificate.transfer_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }))}) Tj ET`,
    `BT /F1 11 Tf 48 664 Td (Sender: ${pdfEscape(certificate.sender_organization_name)}) Tj ET`,
    `BT /F1 11 Tf 48 644 Td (Receiver: ${pdfEscape(certificate.receiver_organization_name)}) Tj ET`,
    `BT /F1 11 Tf 48 624 Td (Resource: ${pdfEscape(certificate.item_name)}) Tj ET`,
    `BT /F1 11 Tf 48 604 Td (Category: ${pdfEscape(certificate.category)}) Tj ET`,
    `BT /F1 11 Tf 48 584 Td (Quantity: ${pdfEscape(certificate.quantity)} ${pdfEscape(certificate.unit)}) Tj ET`,
    `BT /F1 11 Tf 48 564 Td (Estimated value: ${pdfEscape(certificate.currency)} ${pdfEscape(certificate.estimated_value.toLocaleString())}) Tj ET`,
    `BT /F1 11 Tf 48 544 Td (Location: ${pdfEscape(certificate.location)}) Tj ET`,
    `BT /F1 11 Tf 48 524 Td (Handover method: ${pdfEscape(certificate.handover_method)}) Tj ET`,
    `BT /F1 13 Tf 48 488 Td (Impact Summary) Tj ET`,
    `BT /F1 10 Tf 48 468 Td (AED recovered: ${pdfEscape(certificate.impact_snapshot.aed_recovered.toLocaleString())}) Tj ET`,
    `BT /F1 10 Tf 48 452 Td (Waste prevented: ${pdfEscape(certificate.impact_snapshot.waste_prevented_kg.toLocaleString())} kg) Tj ET`,
    `BT /F1 10 Tf 48 436 Td (CO2 saved: ${pdfEscape(certificate.impact_snapshot.co2_saved_kg.toLocaleString())} kg) Tj ET`,
    `BT /F1 13 Tf 48 400 Td (Trust Summary) Tj ET`,
    `BT /F1 10 Tf 48 380 Td (${pdfEscape(certificate.trust_snapshot.level)} trust - ${pdfEscape(certificate.trust_snapshot.score)}/100) Tj ET`,
    `BT /F1 10 Tf 48 364 Td (${pdfEscape(certificate.trust_snapshot.verification_level)} - ${pdfEscape(certificate.trust_snapshot.verification_status)}) Tj ET`,
    `BT /F1 9 Tf 48 90 Td (Hash: ${pdfEscape(certificate.certificate_hash)}) Tj ET`,
    `BT /F1 9 Tf 48 74 Td (Verify: ${pdfEscape(verificationUrl(certificate.qr_verification_token))}) Tj ET`,
    "BT /F1 8 Tf 48 52 Td (This certificate confirms a completed ReDist transfer. It is not a tax invoice or payment receipt.) Tj ET",
  ];

  const startX = 456;
  const startY = 706;
  const cell = 8;
  lines.push("0 0 0 rg");
  qrCells(certificate.qr_verification_token).forEach((filled, index) => {
    if (!filled) return;
    const x = startX + (index % 7) * cell;
    const y = startY - Math.floor(index / 7) * cell;
    lines.push(rectCommand(x, y, cell - 1, cell - 1));
  });
  lines.push(`BT /F1 8 Tf 438 628 Td (QR Token) Tj ET`);

  const content = lines.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  const chunks = ["%PDF-1.4\n"];
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(chunks.join("").length);
    chunks.push(`${index + 1} 0 obj\n${object}\nendobj\n`);
  });

  const xrefOffset = chunks.join("").length;
  chunks.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach((offset) => {
    chunks.push(`${String(offset).padStart(10, "0")} 00000 n \n`);
  });
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  return new TextEncoder().encode(chunks.join(""));
}

export async function listTransferCertificates(supabase: Client, filters: TransferCertificateSearchInput) {
  let query = supabase
    .from("transfer_certificates")
    .select("*")
    .order("issued_at", { ascending: false })
    .range(filters.offset, filters.offset + filters.limit - 1);

  if (filters.organization_id) {
    query = query.or(`sender_organization_id.eq.${filters.organization_id},receiver_organization_id.eq.${filters.organization_id}`);
  }

  if (filters.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function issueTransferCertificate(supabase: Client, input: CreateTransferCertificateInput) {
  const { data, error } = await supabase.rpc("issue_transfer_certificate", {
    target_transaction_id: input.transaction_id,
    target_listing_request_id: input.listing_request_id ?? null,
    target_sender_organization_id: input.sender_organization_id,
    target_receiver_organization_id: input.receiver_organization_id ?? null,
    target_sender_organization_name: input.sender_organization_name,
    target_receiver_organization_name: input.receiver_organization_name,
    target_item_name: input.item_name,
    target_category: input.category,
    target_quantity: input.quantity,
    target_unit: input.unit,
    target_estimated_value: input.estimated_value,
    target_currency: input.currency,
    target_transfer_date: input.transfer_date,
    target_location: input.location,
    target_handover_method: input.handover_method,
    target_trust_snapshot: input.trust_snapshot,
    target_impact_snapshot: input.impact_snapshot,
  });

  if (error) throw error;
  return data;
}

export async function verifyTransferCertificate(supabase: Client, token: string) {
  const { data, error } = await supabase.rpc("verify_transfer_certificate", { target_token: token });
  if (error) throw error;
  return data;
}
