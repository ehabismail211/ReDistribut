import type { SupabaseClient, User } from "@supabase/supabase-js";

export const platformRoles = [
  "founder",
  "platform_admin",
  "reviewer",
  "pilot_coordinator",
  "organization_admin",
  "organization_user",
] as const;

export type PlatformRole = (typeof platformRoles)[number];

export type Permission =
  | "founder.route.access"
  | "pilot.monitor.read"
  | "admin.route.access"
  | "verification.review"
  | "verification.document.review"
  | "verification.create"
  | "organization.manage"
  | "organization.read"
  | "listing.create"
  | "listing.manage"
  | "request.create"
  | "request.manage"
  | "trust.recalculate"
  | "impact.calculate.persist"
  | "audit.read";

type PermissionContext = {
  request: Request;
  supabase?: SupabaseClient;
  user?: User;
  permission: Permission;
  organizationId?: string | null;
  entityType?: string;
  entityId?: string | null;
};

type ActorRoleResolution = {
  roles: PlatformRole[];
  primaryRole: PlatformRole | null;
  source: "supabase_claims" | "user_platform_roles" | "organization_membership" | "none";
};

const rolePermissions: Record<PlatformRole, Permission[]> = {
  founder: [
    "founder.route.access",
    "pilot.monitor.read",
    "admin.route.access",
    "verification.review",
    "verification.document.review",
    "verification.create",
    "organization.manage",
    "organization.read",
    "listing.create",
    "listing.manage",
    "request.create",
    "request.manage",
    "trust.recalculate",
    "impact.calculate.persist",
    "audit.read",
  ],
  platform_admin: [
    "pilot.monitor.read",
    "admin.route.access",
    "verification.review",
    "verification.document.review",
    "verification.create",
    "organization.manage",
    "organization.read",
    "listing.create",
    "listing.manage",
    "request.create",
    "request.manage",
    "trust.recalculate",
    "impact.calculate.persist",
    "audit.read",
  ],
  reviewer: [
    "verification.review",
    "verification.document.review",
    "organization.read",
    "audit.read",
  ],
  pilot_coordinator: [
    "pilot.monitor.read",
    "organization.read",
    "request.manage",
    "audit.read",
  ],
  organization_admin: [
    "verification.create",
    "organization.manage",
    "organization.read",
    "listing.create",
    "listing.manage",
    "request.create",
    "request.manage",
    "audit.read",
  ],
  organization_user: [
    "organization.read",
    "request.create",
  ],
};

export class PermissionError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 403, details?: unknown) {
    super(message);
    this.name = "PermissionError";
    this.status = status;
    this.details = details;
  }
}

export function isPlatformRole(value: string | null | undefined): value is PlatformRole {
  return Boolean(value && (platformRoles as readonly string[]).includes(value));
}

export function roleHasPermission(role: PlatformRole | null, permission: Permission) {
  if (!role) return false;
  return rolePermissions[role].includes(permission);
}

function normalizeRoles(values: unknown[]) {
  return [...new Set(values.filter((value): value is PlatformRole => isPlatformRole(String(value)) as boolean))];
}

function readRoleValues(value: unknown): unknown[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(",").map((item) => item.trim());
  return [];
}

export function rolesFromUserClaims(user: User | undefined) {
  if (!user) return [];

  const appMetadata = user.app_metadata ?? {};
  const userMetadata = user.user_metadata ?? {};

  return normalizeRoles([
    ...readRoleValues(appMetadata.redist_platform_roles),
    ...readRoleValues(appMetadata.platform_roles),
    ...readRoleValues(appMetadata.roles),
    appMetadata.redist_platform_role,
    appMetadata.platform_role,
    appMetadata.role,
    ...readRoleValues(userMetadata.redist_platform_roles),
    userMetadata.redist_platform_role,
  ]);
}

export async function rolesFromPlatformAssignments(supabase: SupabaseClient | undefined, user: User | undefined) {
  if (!supabase || !user) return [];

  const { data, error } = await supabase
    .from("user_platform_roles")
    .select("role")
    .eq("user_id", user.id)
    .is("revoked_at", null)
    .returns<Array<{ role: string }>>();

  if (error || !data) return [];
  return normalizeRoles(data.map((item) => item.role));
}

export async function resolveActorRoles(context: {
  supabase?: SupabaseClient;
  user?: User;
  organizationId?: string | null;
}): Promise<ActorRoleResolution> {
  const claimRoles = rolesFromUserClaims(context.user);
  const assignmentRoles = await rolesFromPlatformAssignments(context.supabase, context.user);
  const roles = normalizeRoles([...claimRoles, ...assignmentRoles]);

  if (roles.length > 0) {
    return {
      roles,
      primaryRole: roles[0],
      source: claimRoles.length > 0 ? "supabase_claims" : "user_platform_roles",
    };
  }

  if (context.organizationId && context.supabase && context.user) {
    const organizationRole = await getOrganizationRole(context.supabase, context.user, context.organizationId);
    if (organizationRole) {
      return {
        roles: [organizationRole],
        primaryRole: organizationRole,
        source: "organization_membership",
      };
    }
  }

  return { roles: [], primaryRole: null, source: "none" };
}

export async function requireRoutePermission(context: {
  request: Request;
  supabase?: SupabaseClient;
  user?: User;
  permission: Permission;
}) {
  const actor = await resolveActorRoles({ supabase: context.supabase, user: context.user });
  if (!actor.roles.some((role) => roleHasPermission(role, context.permission))) {
    throw new PermissionError("Permission denied.", context.user ? 403 : 401, {
      permission: context.permission,
      roles: actor.roles,
      source: actor.source,
    });
  }

  return actor;
}

export async function recordPermissionAudit(context: {
  supabase: SupabaseClient;
  request: Request;
  user?: User;
  permission: Permission;
  decision: "allowed" | "denied";
  organizationId?: string | null;
  entityType?: string;
  entityId?: string | null;
  details?: Record<string, unknown>;
}) {
  const actor = await resolveActorRoles({
    supabase: context.supabase,
    user: context.user,
    organizationId: context.organizationId,
  });
  await context.supabase
    .rpc("record_permission_audit_event", {
      target_permission: context.permission,
      target_decision: context.decision,
      target_actor_role: actor.primaryRole,
      target_entity_type: context.entityType ?? "permission",
      target_entity_id: context.entityId ?? null,
      target_organization_id: context.organizationId ?? null,
      event_details: {
        ...(context.details ?? {}),
        role_source: actor.source,
        roles: actor.roles,
      },
    })
    .throwOnError();
}

export async function requirePermission(context: PermissionContext) {
  const actor = await resolveActorRoles({
    supabase: context.supabase,
    user: context.user,
    organizationId: context.organizationId,
  });
  const allowedByRole = actor.roles.some((role) => roleHasPermission(role, context.permission));

  if (!allowedByRole) {
    if (context.supabase) {
      await recordPermissionAudit({
        supabase: context.supabase,
        request: context.request,
        user: context.user,
        permission: context.permission,
        decision: "denied",
        organizationId: context.organizationId,
        entityType: context.entityType,
        entityId: context.entityId,
        details: { reason: "missing_permission" },
      }).catch(() => undefined);
    }

    throw new PermissionError("Permission denied.", context.user ? 403 : 401, {
      permission: context.permission,
      roles: actor.roles,
      source: actor.source,
      organizationId: context.organizationId,
    });
  }

  if (context.supabase) {
    await recordPermissionAudit({
      supabase: context.supabase,
      request: context.request,
      user: context.user,
      permission: context.permission,
      decision: "allowed",
      organizationId: context.organizationId,
      entityType: context.entityType,
      entityId: context.entityId,
    }).catch(() => undefined);
  }

  return actor;
}

async function getOrganizationRole(
  supabase: SupabaseClient | undefined,
  user: User | undefined,
  organizationId: string,
) {
  if (!supabase || !user) return null;

  const { data, error } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("user_id", user.id)
    .maybeSingle<{ role: string }>();

  if (error || !data) return null;

  const normalizedRole: PlatformRole = data.role === "admin" || data.role === "organization_admin"
    ? "organization_admin"
    : "organization_user";

  return normalizedRole;
}

export async function getListingOrganizationId(supabase: SupabaseClient, listingId: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("organization_id")
    .eq("id", listingId)
    .single<{ organization_id: string }>();

  if (error) throw error;
  return data.organization_id;
}

export async function getVerificationOrganizationId(supabase: SupabaseClient, verificationId: string) {
  const { data, error } = await supabase
    .from("organization_verifications")
    .select("organization_id")
    .eq("id", verificationId)
    .single<{ organization_id: string }>();

  if (error) throw error;
  return data.organization_id;
}

export async function getRequestScope(supabase: SupabaseClient, requestId: string) {
  const { data, error } = await supabase
    .from("listing_requests")
    .select("requester_id, listings(organization_id)")
    .eq("id", requestId)
    .single<{ requester_id: string; listings: { organization_id: string } | null }>();

  if (error) throw error;
  if (!data.listings?.organization_id) {
    throw new PermissionError("Request scope could not be resolved.", 404);
  }

  return {
    requesterId: data.requester_id,
    organizationId: data.listings.organization_id,
  };
}

export function requireRequesterOrPermission(context: PermissionContext & { requesterId: string }) {
  if (context.user?.id === context.requesterId) {
    return resolveActorRoles({
      supabase: context.supabase,
      user: context.user,
      organizationId: context.organizationId,
    });
  }

  return requirePermission(context);
}
