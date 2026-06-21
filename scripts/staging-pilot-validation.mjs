import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const { createClient } = require("@supabase/supabase-js");

const seedPath = "supabase/seeds/staging_pilot_seed.sql";

function unquoteEnvValue(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function loadEnvFile(path) {
  if (!existsSync(path)) return false;

  const content = readFileSync(path, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = unquoteEnvValue(trimmed.slice(separator + 1));
    if (!key || process.env[key] != null) continue;
    process.env[key] = value;
  }

  return true;
}

const loadedEnvFiles = [
  ".env.staging.local",
  ".env.staging",
  ".env.local",
].filter(loadEnvFile);

const defaultPassword = process.env.STAGING_PILOT_PASSWORD || "ReDistPilot!2026";

const platformAccounts = [
  {
    key: "FOUNDER",
    label: "Founder",
    email: "founder@staging.redist.ae",
    role: "founder",
  },
  {
    key: "PLATFORM_ADMIN",
    label: "Platform Admin",
    email: "platform-admin@staging.redist.ae",
    role: "platform_admin",
  },
  {
    key: "REVIEWER",
    label: "Reviewer",
    email: "reviewer@staging.redist.ae",
    role: "reviewer",
  },
  {
    key: "PILOT_COORDINATOR",
    label: "Pilot Coordinator",
    email: "pilot-coordinator@staging.redist.ae",
    role: "pilot_coordinator",
  },
];

const organizations = [
  {
    name: "Restaurant A",
    slug: "restaurant-a",
    id: "30000000-0000-4000-8000-000000000001",
    adminEmail: "restaurant-a-admin@staging.redist.ae",
    userEmail: "restaurant-a-user@staging.redist.ae",
  },
  {
    name: "Restaurant B",
    slug: "restaurant-b",
    id: "30000000-0000-4000-8000-000000000002",
    adminEmail: "restaurant-b-admin@staging.redist.ae",
    userEmail: "restaurant-b-user@staging.redist.ae",
  },
  {
    name: "Hotel A",
    slug: "hotel-a",
    id: "30000000-0000-4000-8000-000000000003",
    adminEmail: "hotel-a-admin@staging.redist.ae",
    userEmail: "hotel-a-user@staging.redist.ae",
  },
  {
    name: "Warehouse A",
    slug: "warehouse-a",
    id: "30000000-0000-4000-8000-000000000004",
    adminEmail: "warehouse-a-admin@staging.redist.ae",
    userEmail: "warehouse-a-user@staging.redist.ae",
  },
  {
    name: "NGO A",
    slug: "ngo-a",
    id: "30000000-0000-4000-8000-000000000005",
    adminEmail: "ngo-a-admin@staging.redist.ae",
    userEmail: "ngo-a-user@staging.redist.ae",
  },
];

const results = [];

function record(name, status, details = "") {
  results.push({ name, status, details });
  const icon = status === "pass" ? "PASS" : status === "skip" ? "SKIP" : "FAIL";
  console.log(`${icon} ${name}${details ? ` - ${details}` : ""}`);
}

function assertCheck(name, condition, details = "") {
  if (!condition) {
    record(name, "fail", details);
    return false;
  }

  record(name, "pass", details);
  return true;
}

function requiredEnv() {
  return {
    appUrl: process.env.STAGING_APP_URL,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

function passwordFor(accountKey) {
  return process.env[`STAGING_${accountKey}_PASSWORD`] || defaultPassword;
}

function appUrl(path) {
  return new URL(path, process.env.STAGING_APP_URL).toString();
}

async function fetchApp(path, options = {}) {
  const headers = new Headers(options.headers ?? {});
  if (options.token) headers.set("authorization", `Bearer ${options.token}`);
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers.set("x-vercel-protection-bypass", process.env.VERCEL_AUTOMATION_BYPASS_SECRET);
  }
  if (options.body && !headers.has("content-type")) headers.set("content-type", "application/json");

  return fetch(appUrl(path), {
    method: options.method ?? "GET",
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers,
    redirect: "manual",
  });
}

async function signIn(account) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  const { data, error } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: passwordFor(account.key),
  });

  if (error || !data.session?.access_token) {
    throw new Error(error?.message ?? `No access token returned for ${account.email}`);
  }

  return { supabase, token: data.session.access_token, user: data.user };
}

async function expectHttp(name, response, allowedStatuses) {
  const allowed = allowedStatuses.includes(response.status);
  const details = `status ${response.status}`;
  assertCheck(name, allowed, details);
  return allowed;
}

async function jsonFrom(response) {
  return response.json().catch(() => null);
}

async function staticValidation() {
  const seedExists = existsSync(seedPath);
  assertCheck("staging seed file exists", seedExists, seedPath);
  if (!seedExists) return;

  const seed = readFileSync(seedPath, "utf8");
  for (const account of platformAccounts) {
    assertCheck(`${account.label} seed account exists`, seed.includes(account.email), account.email);
    assertCheck(`${account.label} role assignment exists`, seed.includes(`'${account.role}'`), account.role);
  }

  for (const organization of organizations) {
    assertCheck(`${organization.name} seed organization exists`, seed.includes(organization.name), organization.slug);
    assertCheck(`${organization.name} admin membership exists`, seed.includes(organization.adminEmail), organization.adminEmail);
    assertCheck(`${organization.name} user membership exists`, seed.includes(organization.userEmail), organization.userEmail);
  }
}

async function liveValidation() {
  const env = requiredEnv();
  const missing = Object.entries(env)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    const loaded = loadedEnvFiles.length > 0 ? ` loaded env files: ${loadedEnvFiles.join(", ")}` : " no staging env file loaded";
    const message = `missing env: ${missing.join(", ")};${loaded}`;
    if (process.env.STAGING_REQUIRE_LIVE === "true") {
      record("live staging validation configuration", "fail", message);
      return;
    }

    record("live staging validation", "skip", message);
    return;
  }

  const service = createClient(env.supabaseUrl, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const sessions = new Map();
  const platformUserIds = [];
  const organizationUserIds = [];

  for (const account of platformAccounts) {
    try {
      const session = await signIn(account);
      sessions.set(account.email, session);
      platformUserIds.push(session.user.id);
      assertCheck(`${account.label} login`, Boolean(session.token), account.email);

      const claimRoles = session.user.app_metadata?.redist_platform_roles ?? [];
      assertCheck(`${account.label} auth claim role`, claimRoles.includes(account.role), account.role);

      const { error: signOutError } = await session.supabase.auth.signOut();
      const { data: postLogout } = await session.supabase.auth.getSession();
      assertCheck(`${account.label} logout`, !signOutError && !postLogout.session, account.email);

      const freshSession = await signIn(account);
      sessions.set(account.email, freshSession);
    } catch (error) {
      record(`${account.label} login/logout`, "fail", error instanceof Error ? error.message : String(error));
    }
  }

  const organizationAccounts = organizations.flatMap((organization) => [
    {
      key: `${organization.slug.toUpperCase().replaceAll("-", "_")}_ADMIN`,
      label: `${organization.name} Organization Admin`,
      email: organization.adminEmail,
      organizationId: organization.id,
      expectedRole: "organization_admin",
    },
    {
      key: `${organization.slug.toUpperCase().replaceAll("-", "_")}_USER`,
      label: `${organization.name} Organization User`,
      email: organization.userEmail,
      organizationId: organization.id,
      expectedRole: "organization_user",
    },
  ]);

  for (const account of organizationAccounts) {
    try {
      const session = await signIn(account);
      sessions.set(account.email, session);
      organizationUserIds.push(session.user.id);
      assertCheck(`${account.label} login`, Boolean(session.token), account.email);
    } catch (error) {
      record(`${account.label} login`, "fail", error instanceof Error ? error.message : String(error));
    }
  }

  const { data: platformRows, error: platformError } = await service
    .from("user_platform_roles")
    .select("user_id,role,revoked_at")
    .in("user_id", platformUserIds)
    .is("revoked_at", null);
  assertCheck("role assignment rows", !platformError && platformRows?.length === platformAccounts.length, `${platformRows?.length ?? 0}/${platformAccounts.length}`);

  const { data: orgRows, error: orgError } = await service
    .from("organizations")
    .select("id,slug,name")
    .in("id", organizations.map((organization) => organization.id));
  assertCheck("pilot organizations exist", !orgError && orgRows?.length === organizations.length, `${orgRows?.length ?? 0}/${organizations.length}`);

  const { data: membershipRows, error: membershipError } = await service
    .from("organization_members")
    .select("organization_id,user_id,role")
    .in("organization_id", organizations.map((organization) => organization.id))
    .in("user_id", organizationUserIds);
  assertCheck("pilot organization memberships exist", !membershipError && membershipRows?.length === organizations.length * 2, `${membershipRows?.length ?? 0}/${organizations.length * 2}`);

  const founder = sessions.get("founder@staging.redist.ae");
  const platformAdmin = sessions.get("platform-admin@staging.redist.ae");
  const reviewer = sessions.get("reviewer@staging.redist.ae");
  const pilotCoordinator = sessions.get("pilot-coordinator@staging.redist.ae");
  const restaurantAAdmin = sessions.get("restaurant-a-admin@staging.redist.ae");
  const restaurantAUser = sessions.get("restaurant-a-user@staging.redist.ae");

  if (founder) {
    await expectHttp("founder dashboard access", await fetchApp("/app/pilot-monitoring", { token: founder.token }), [200]);
    await expectHttp("founder audit API access", await fetchApp("/api/v1/audit", { token: founder.token }), [200]);

    const trustResponse = await fetchApp(`/api/v1/organizations/${organizations[0].id}/trust-score/recalculate`, {
      token: founder.token,
      method: "POST",
      body: {
        organization_id: organizations[0].id,
        reason: "staging_live_validation",
        metrics: {
          verificationLevel: "business_verified",
          completedTransactions: 10,
          averageResponseHours: 4,
          acceptanceRate: 0.9,
          cancellationRate: 0.02,
          disputeRate: 0,
          negativeAuditEvents: 0,
          profileCompleteness: 0.95,
          approvedDocuments: 3,
          expiredDocuments: 0,
          rejectedDocuments: 0,
        },
      },
    });
    const trustOk = await expectHttp("trust updates", trustResponse, [200]);
    if (trustOk) {
      const trustJson = await jsonFrom(trustResponse);
      assertCheck("trust update persisted", Boolean(trustJson?.data?.score), "trust score response");
    }

    const impactResponse = await fetchApp("/api/v1/impact/calculate", {
      token: founder.token,
      method: "POST",
      body: {
        snapshot: {
          scope: "organization",
          organization_id: organizations[0].id,
          country_code: "AE",
          period_start: "2026-06-01",
          period_end: "2026-06-30",
        },
        listings: [
          {
            id: "staging-impact-listing-restaurant-a",
            title: "Staging validation meals",
            category: "Food and Beverage",
            city: "Dubai",
            quantityAvailable: 0,
            unit: "meals",
            unitPrice: 15,
            status: "completed",
          },
        ],
        requests: [
          {
            id: "staging-impact-request-restaurant-a",
            listingId: "staging-impact-listing-restaurant-a",
            quantity: 10,
            status: "completed",
          },
        ],
        source: { validation: "live_staging" },
        persist: true,
      },
    });
    const impactOk = await expectHttp("impact updates", impactResponse, [200]);
    if (impactOk) {
      const impactJson = await jsonFrom(impactResponse);
      assertCheck("impact update persisted", Boolean(impactJson?.data?.saved), "impact saved response");
    }

    const transactionId = `staging-validation-${Date.now()}`;
    const certificateResponse = await fetchApp("/api/v1/certificates", {
      token: founder.token,
      method: "POST",
      body: {
        transaction_id: transactionId,
        sender_organization_id: organizations[0].id,
        receiver_organization_id: organizations[4].id,
        sender_organization_name: "Restaurant A",
        receiver_organization_name: "NGO A",
        item_name: "Staging validation meals",
        category: "Food and Beverage",
        quantity: 10,
        unit: "meals",
        estimated_value: 150,
        currency: "AED",
        transfer_date: new Date().toISOString(),
        location: "Dubai",
        handover_method: "Founder validation",
        trust_snapshot: {
          score: 82,
          level: "gold",
          verification_level: "business_verified",
          verification_status: "approved",
        },
        impact_snapshot: {
          aed_recovered: 150,
          resources_redistributed: 10,
          waste_prevented_kg: 5,
          co2_saved_kg: 12,
        },
      },
    });
    const certificateOk = await expectHttp("certificate generation", certificateResponse, [201]);
    if (certificateOk) {
      const certificateJson = await jsonFrom(certificateResponse);
      const token = certificateJson?.data?.qr_verification_token;
      assertCheck("certificate QR token generated", Boolean(token), "qr token");
      if (token) {
        await expectHttp(
          "certificate QR verification",
          await fetchApp(`/api/v1/public/certificates/${encodeURIComponent(token)}`),
          [200],
        );
      }
    }
  }

  await expectHttp("unauthorized founder dashboard blocked", await fetchApp("/app/pilot-monitoring"), [302, 303, 307, 308, 401, 403]);
  await expectHttp("unauthorized audit API blocked", await fetchApp("/api/v1/audit"), [401, 403]);

  if (platformAdmin) {
    await expectHttp("platform admin API protection", await fetchApp("/api/v1/audit", { token: platformAdmin.token }), [200]);
  }

  if (reviewer) {
    await expectHttp("reviewer access", await fetchApp("/api/v1/verifications", { token: reviewer.token }), [200]);
    await expectHttp("reviewer founder route denied", await fetchApp("/app/pilot-monitoring", { token: reviewer.token }), [302, 303, 307, 308, 401, 403]);
  }

  if (pilotCoordinator) {
    await expectHttp("pilot coordinator founder route denied", await fetchApp("/app/pilot-monitoring", { token: pilotCoordinator.token }), [302, 303, 307, 308, 401, 403]);
  }

  if (restaurantAAdmin) {
    await expectHttp(
      "organization admin access",
      await fetchApp(`/api/v1/verifications?organization_id=${organizations[0].id}`, { token: restaurantAAdmin.token }),
      [200],
    );
  }

  if (restaurantAUser) {
    await expectHttp(
      "organization user access",
      await fetchApp(`/api/v1/verifications?organization_id=${organizations[0].id}`, { token: restaurantAUser.token }),
      [200],
    );
  }

  const { data: category } = await service
    .from("categories")
    .select("id")
    .eq("is_restricted", false)
    .limit(1)
    .maybeSingle();

  if (category?.id && restaurantAAdmin) {
    await expectHttp(
      "cross-tenant denial",
      await fetchApp("/api/v1/listings", {
        token: restaurantAAdmin.token,
        method: "POST",
        body: {
          organization_id: organizations[1].id,
          category_id: category.id,
          title: "Cross tenant validation listing",
          description: "This denied write validates tenant isolation before pilot launch.",
          reason: "excess",
          offer_type: "free",
          quantity_total: 1,
          unit: "item",
          city: "Dubai",
          country_code: "AE",
        },
      }),
      [401, 403],
    );
  } else {
    record("cross-tenant denial", "skip", "missing category or restaurant admin session");
  }

  if (category?.id && restaurantAUser) {
    await expectHttp(
      "organization user restricted from listing creation",
      await fetchApp("/api/v1/listings", {
        token: restaurantAUser.token,
        method: "POST",
        body: {
          organization_id: organizations[0].id,
          category_id: category.id,
          title: "Organization user restriction validation",
          description: "This denied write validates role restrictions before pilot launch.",
          reason: "excess",
          offer_type: "free",
          quantity_total: 1,
          unit: "item",
          city: "Dubai",
          country_code: "AE",
        },
      }),
      [401, 403],
    );
  } else {
    record("organization user restricted from listing creation", "skip", "missing category or organization user session");
  }

  const { data: auditRows, error: auditError } = await service
    .from("permission_audit_events")
    .select("id,decision,permission,created_at")
    .eq("decision", "denied")
    .order("created_at", { ascending: false })
    .limit(1);
  assertCheck("audit logging", !auditError && Boolean(auditRows?.length), `${auditRows?.length ?? 0} denied events`);
}

await staticValidation();
await liveValidation();

const failed = results.filter((result) => result.status === "fail");
const skipped = results.filter((result) => result.status === "skip");

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  total: results.length,
  passed: results.length - failed.length - skipped.length,
  skipped: skipped.length,
  failed: failed.length,
  results,
}, null, 2));

if (failed.length > 0) {
  process.exitCode = 1;
}
