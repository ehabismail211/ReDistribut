import { z } from "zod";

export const listingReasons = ["excess", "near_expiry", "slow_moving", "other"] as const;
export const offerTypes = ["free", "sale", "exchange"] as const;
export const listingStatuses = ["draft", "published", "paused", "completed", "expired", "removed"] as const;
export const requestStatuses = ["pending", "accepted", "declined", "cancelled", "completed"] as const;
export const verificationLevels = [
  "unverified",
  "basic_verified",
  "business_verified",
  "enterprise_verified",
  "ngo_verified",
  "government_verified",
] as const;
export const verificationStatuses = [
  "draft",
  "submitted",
  "pending_review",
  "needs_changes",
  "approved",
  "rejected",
  "suspended",
  "expired",
] as const;
export const verificationDocumentTypes = [
  "trade_license",
  "vat_trn",
  "food_permit",
  "storage_permit",
  "ngo_license",
  "government_authorization",
  "other",
] as const;
export const trustScoreLevels = ["bronze", "silver", "gold", "platinum"] as const;
export const impactScopes = ["user", "organization", "platform"] as const;
export const transferCertificateStatuses = ["issued", "revoked", "superseded", "expired"] as const;
export const reservationStatuses = ["active", "released", "expired", "converted"] as const;
export const redistributionTransactionStatuses = ["pending_handover", "completed", "cancelled", "disputed"] as const;
export const handoverStatuses = ["scheduled", "completed", "failed", "disputed"] as const;
export const handoverEvidenceTypes = ["photo", "document", "signature", "note", "manual_attestation"] as const;
export const privateFileAssetTypes = [
  "verification_document",
  "handover_evidence",
  "pilot_approval",
  "incident_evidence",
] as const;
export const pilotControlStatuses = ["draft", "approved", "active", "blocked", "retired"] as const;

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(1200).optional(),
  country_code: z.string().trim().length(2).toUpperCase(),
  city: z.string().trim().min(2).max(120),
});

export const upsertProfileSchema = z.object({
  display_name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().max(40).optional().nullable(),
  country_code: z.string().trim().length(2).toUpperCase().optional().nullable(),
  city: z.string().trim().max(120).optional().nullable(),
});

export const listingBaseSchema = z.object({
    organization_id: z.string().uuid(),
    category_id: z.string().uuid(),
    title: z.string().trim().min(3).max(140),
    description: z.string().trim().min(10).max(3000),
    reason: z.enum(listingReasons),
    offer_type: z.enum(offerTypes),
    quantity_total: z.coerce.number().positive(),
    unit: z.string().trim().min(1).max(40),
    unit_price: z.coerce.number().nonnegative().optional().nullable(),
    currency: z.string().trim().length(3).toUpperCase().optional().nullable(),
    expiry_date: z.string().date().optional().nullable(),
    city: z.string().trim().min(2).max(120),
    country_code: z.string().trim().length(2).toUpperCase(),
  });

export const createListingSchema = listingBaseSchema
  .superRefine((value, context) => {
    if (value.offer_type === "sale" && (value.unit_price == null || !value.currency)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sale listings require unit_price and currency.",
        path: ["unit_price"],
      });
    }
  });

export const updateListingSchema = listingBaseSchema.partial();

export const createListingRequestSchema = z.object({
  requested_quantity: z.coerce.number().positive(),
  message: z.string().trim().max(1000).optional().nullable(),
});

export const resourceReservationSchema = z.object({
  id: z.string().uuid().optional(),
  listing_request_id: z.string().uuid(),
  listing_id: z.string().uuid(),
  sender_organization_id: z.string().uuid(),
  requester_id: z.string().uuid(),
  quantity: z.coerce.number().positive(),
  unit: z.string().trim().min(1).max(40),
  status: z.enum(reservationStatuses).default("active"),
  expires_at: z.string().datetime().optional().nullable(),
});

export const redistributionTransactionSchema = z.object({
  id: z.string().uuid().optional(),
  transaction_number: z.string().trim().min(3).max(80).optional(),
  listing_request_id: z.string().uuid(),
  reservation_id: z.string().uuid().optional().nullable(),
  listing_id: z.string().uuid(),
  sender_organization_id: z.string().uuid(),
  receiver_user_id: z.string().uuid(),
  receiver_organization_id: z.string().uuid().optional().nullable(),
  resource_name: z.string().trim().min(2).max(180),
  category_id: z.string().uuid().optional().nullable(),
  quantity: z.coerce.number().positive(),
  unit: z.string().trim().min(1).max(40),
  estimated_value: z.coerce.number().nonnegative().default(0),
  currency: z.string().trim().length(3).toUpperCase().default("AED"),
  status: z.enum(redistributionTransactionStatuses).default("completed"),
  transfer_location: z.string().trim().min(2).max(180),
  handover_method: z.string().trim().min(2).max(160),
  completed_at: z.string().datetime().optional(),
  immutable_snapshot: z.record(z.string(), z.unknown()).default({}),
});

export const handoverRecordSchema = z.object({
  id: z.string().uuid().optional(),
  transaction_id: z.string().uuid(),
  listing_request_id: z.string().uuid(),
  sender_organization_id: z.string().uuid(),
  receiver_user_id: z.string().uuid(),
  status: z.enum(handoverStatuses).default("completed"),
  handover_method: z.string().trim().min(2).max(160),
  handover_location: z.string().trim().min(2).max(180),
  scheduled_at: z.string().datetime().optional().nullable(),
  completed_at: z.string().datetime().optional().nullable(),
  evidence_required: z.boolean().default(true),
  pilot_manual_control: z.boolean().default(true),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export const handoverEvidenceSchema = z.object({
  handover_record_id: z.string().uuid(),
  transaction_id: z.string().uuid(),
  organization_id: z.string().uuid(),
  private_file_asset_id: z.string().uuid().optional().nullable(),
  evidence_type: z.enum(handoverEvidenceTypes),
  notes: z.string().trim().max(2000).optional().nullable(),
}).superRefine((value, context) => {
  if (!value.private_file_asset_id && !value.notes) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Handover evidence requires either a private file asset or notes.",
      path: ["private_file_asset_id"],
    });
  }
});

export const privateFileAssetSchema = z.object({
  organization_id: z.string().uuid(),
  asset_type: z.enum(privateFileAssetTypes),
  storage_bucket: z.string().trim().min(3).max(120).default("redist-private-evidence"),
  storage_path: z.string().trim().regex(/^private\/[a-f0-9-]{36}\/[a-z0-9/_.,=-]+$/),
  original_filename: z.string().trim().max(240).optional().nullable(),
  content_type: z.string().trim().max(120).optional().nullable(),
  file_size_bytes: z.coerce.number().int().positive().optional().nullable(),
  checksum_sha256: z.string().trim().regex(/^[a-f0-9]{64}$/).optional().nullable(),
  retention_until: z.string().date().optional().nullable(),
});

export const pilotSafetyControlSchema = z.object({
  control_key: z.string().trim().regex(/^[a-z0-9_]+$/),
  control_area: z.enum(["security", "sop", "support", "mobile_qa", "observability", "backup", "category_policy"]),
  title: z.string().trim().min(3).max(160),
  status: z.enum(pilotControlStatuses),
  owner_name: z.string().trim().min(2).max(120),
  evidence_required: z.string().trim().min(3).max(500),
  validation_method: z.string().trim().min(3).max(500),
  approved_by: z.string().trim().max(120).optional().nullable(),
  approved_at: z.string().datetime().optional().nullable(),
  due_before_external_pilot: z.boolean().default(true),
});

export const createVerificationSchema = z.object({
  organization_id: z.string().uuid(),
  country_code: z.string().trim().length(2).toUpperCase(),
  level: z.enum(verificationLevels).default("unverified"),
  status_code: z.enum(verificationStatuses).default("draft"),
  expires_at: z.string().datetime().optional().nullable(),
  review_notes: z.string().trim().max(4000).optional().nullable(),
  internal_notes: z.string().trim().max(4000).optional().nullable(),
});

export const updateVerificationSchema = z.object({
  level: z.enum(verificationLevels).optional(),
  status_code: z.enum(verificationStatuses).optional(),
  expires_at: z.string().datetime().optional().nullable(),
  review_notes: z.string().trim().max(4000).optional().nullable(),
  internal_notes: z.string().trim().max(4000).optional().nullable(),
});

export const submitVerificationSchema = z.object({
  notes: z.string().trim().max(1000).optional().nullable(),
});

export const reviewVerificationSchema = z.object({
  status_code: z.enum(["needs_changes", "approved", "rejected", "suspended", "expired"]),
  level: z.enum(verificationLevels).optional(),
  review_notes: z.string().trim().max(4000).optional().nullable(),
  internal_notes: z.string().trim().max(4000).optional().nullable(),
  expires_at: z.string().datetime().optional().nullable(),
});

export const createVerificationDocumentSchema = z.object({
  document_type: z.enum(verificationDocumentTypes),
  document_number: z.string().trim().max(160).optional().nullable(),
  issuing_authority: z.string().trim().max(180).optional().nullable(),
  issue_date: z.string().date().optional().nullable(),
  expiry_date: z.string().date().optional().nullable(),
  storage_path: z.string().trim().min(3).max(500),
  original_filename: z.string().trim().max(240).optional().nullable(),
  content_type: z.string().trim().max(120).optional().nullable(),
  file_size_bytes: z.coerce.number().int().positive().optional().nullable(),
});

export const updateVerificationDocumentSchema = createVerificationDocumentSchema.partial().extend({
  status_code: z.enum(verificationStatuses).optional(),
  review_notes: z.string().trim().max(4000).optional().nullable(),
  rejection_reason: z.string().trim().max(1000).optional().nullable(),
});

export const trustScoreFactorSchema = z.object({
  key: z.string().trim().min(2).max(80),
  label: z.string().trim().min(2).max(120),
  points: z.coerce.number().int().min(-100).max(100),
  detail: z.string().trim().max(500).optional(),
});

export const trustScoreSnapshotSchema = z.object({
  organization_id: z.string().uuid(),
  score: z.coerce.number().int().min(0).max(100),
  level: z.enum(trustScoreLevels),
  factors: z.array(trustScoreFactorSchema),
  calculated_at: z.string().datetime().optional(),
});

export const recalculateTrustScoreSchema = z.object({
  organization_id: z.string().uuid(),
  reason: z.string().trim().max(240).optional().default("manual_recalculation"),
});

export const impactBreakdownItemSchema = z.object({
  label: z.string().trim().min(1).max(120),
  value: z.coerce.number().nonnegative(),
  aed_recovered: z.coerce.number().nonnegative().optional().default(0),
  completed_transactions: z.coerce.number().int().nonnegative().optional().default(0),
});

export const impactMetricSnapshotSchema = z.object({
  scope: z.enum(impactScopes),
  user_id: z.string().uuid().optional().nullable(),
  organization_id: z.string().uuid().optional().nullable(),
  country_code: z.string().trim().length(2).toUpperCase().optional().nullable(),
  period_start: z.string().date(),
  period_end: z.string().date(),
  aed_recovered: z.coerce.number().nonnegative(),
  resources_redistributed: z.coerce.number().nonnegative(),
  waste_prevented_kg: z.coerce.number().nonnegative(),
  co2_saved_kg: z.coerce.number().nonnegative(),
  completed_transactions: z.coerce.number().int().nonnegative(),
  active_listings: z.coerce.number().int().nonnegative(),
  active_requests: z.coerce.number().int().nonnegative(),
  top_categories: z.array(impactBreakdownItemSchema).default([]),
  top_locations: z.array(impactBreakdownItemSchema).default([]),
});

export const impactHistorySearchSchema = z.object({
  scope: z.enum(impactScopes).optional(),
  organization_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  country_code: z.string().trim().length(2).toUpperCase().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  offset: z.coerce.number().int().min(0).default(0),
});

export const trustSnapshotSchema = z.object({
  score: z.coerce.number().int().min(0).max(100),
  level: z.string().trim().min(2).max(80),
  verification_level: z.string().trim().min(2).max(80),
  verification_status: z.string().trim().min(2).max(80),
});

export const transferCertificateImpactSnapshotSchema = z.object({
  aed_recovered: z.coerce.number().nonnegative(),
  resources_redistributed: z.coerce.number().nonnegative(),
  waste_prevented_kg: z.coerce.number().nonnegative(),
  co2_saved_kg: z.coerce.number().nonnegative(),
});

export const createTransferCertificateSchema = z.object({
  transaction_id: z.string().trim().min(3).max(120),
  listing_request_id: z.string().uuid().optional().nullable(),
  sender_organization_id: z.string().uuid(),
  receiver_organization_id: z.string().uuid().optional().nullable(),
  sender_organization_name: z.string().trim().min(2).max(160),
  receiver_organization_name: z.string().trim().min(2).max(160),
  item_name: z.string().trim().min(2).max(180),
  category: z.string().trim().min(2).max(120),
  quantity: z.coerce.number().positive(),
  unit: z.string().trim().min(1).max(40),
  estimated_value: z.coerce.number().nonnegative(),
  currency: z.string().trim().length(3).toUpperCase().default("AED"),
  transfer_date: z.string().datetime(),
  location: z.string().trim().min(2).max(160),
  handover_method: z.string().trim().min(2).max(120),
  trust_snapshot: trustSnapshotSchema,
  impact_snapshot: transferCertificateImpactSnapshotSchema,
});

export const transferCertificateSearchSchema = z.object({
  organization_id: z.string().uuid().optional(),
  status: z.enum(transferCertificateStatuses).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  offset: z.coerce.number().int().min(0).default(0),
});

export const listingSearchSchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().uuid().optional(),
  offer_type: z.enum(offerTypes).optional(),
  city: z.string().trim().max(120).optional(),
  country_code: z.string().trim().length(2).toUpperCase().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(24),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpsertProfileInput = z.infer<typeof upsertProfileSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type CreateListingRequestInput = z.infer<typeof createListingRequestSchema>;
export type ListingSearchInput = z.infer<typeof listingSearchSchema>;
export type VerificationLevel = (typeof verificationLevels)[number];
export type VerificationStatus = (typeof verificationStatuses)[number];
export type VerificationDocumentType = (typeof verificationDocumentTypes)[number];
export type TrustScoreLevel = (typeof trustScoreLevels)[number];
export type CreateVerificationInput = z.infer<typeof createVerificationSchema>;
export type UpdateVerificationInput = z.infer<typeof updateVerificationSchema>;
export type SubmitVerificationInput = z.infer<typeof submitVerificationSchema>;
export type ReviewVerificationInput = z.infer<typeof reviewVerificationSchema>;
export type CreateVerificationDocumentInput = z.infer<typeof createVerificationDocumentSchema>;
export type UpdateVerificationDocumentInput = z.infer<typeof updateVerificationDocumentSchema>;
export type TrustScoreFactor = z.infer<typeof trustScoreFactorSchema>;
export type TrustScoreSnapshot = z.infer<typeof trustScoreSnapshotSchema>;
export type RecalculateTrustScoreInput = z.infer<typeof recalculateTrustScoreSchema>;
export type ImpactScope = (typeof impactScopes)[number];
export type ImpactBreakdownItem = z.infer<typeof impactBreakdownItemSchema>;
export type ImpactMetricSnapshot = z.infer<typeof impactMetricSnapshotSchema>;
export type ImpactHistorySearchInput = z.infer<typeof impactHistorySearchSchema>;
export type TransferCertificateStatus = (typeof transferCertificateStatuses)[number];
export type ReservationStatus = (typeof reservationStatuses)[number];
export type RedistributionTransactionStatus = (typeof redistributionTransactionStatuses)[number];
export type HandoverStatus = (typeof handoverStatuses)[number];
export type HandoverEvidenceType = (typeof handoverEvidenceTypes)[number];
export type PrivateFileAssetType = (typeof privateFileAssetTypes)[number];
export type PilotControlStatus = (typeof pilotControlStatuses)[number];
export type ResourceReservation = z.infer<typeof resourceReservationSchema>;
export type RedistributionTransaction = z.infer<typeof redistributionTransactionSchema>;
export type HandoverRecord = z.infer<typeof handoverRecordSchema>;
export type HandoverEvidence = z.infer<typeof handoverEvidenceSchema>;
export type PrivateFileAsset = z.infer<typeof privateFileAssetSchema>;
export type PilotSafetyControl = z.infer<typeof pilotSafetyControlSchema>;
export type TrustSnapshot = z.infer<typeof trustSnapshotSchema>;
export type TransferCertificateImpactSnapshot = z.infer<typeof transferCertificateImpactSnapshotSchema>;
export type CreateTransferCertificateInput = z.infer<typeof createTransferCertificateSchema>;
export type TransferCertificateSearchInput = z.infer<typeof transferCertificateSearchSchema>;
